import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const VISITED_HOME_KEY = 'visited_home_v1';

// Small in-session cache to avoid re-fetching on refresh (sessionStorage survives refresh).
// This reduces Supabase reads on the Free plan while keeping the UI reasonably fresh.
const COUNT_CACHE_KEY = 'home_visit_count_cache_v1';
const COUNT_CACHE_TS_KEY = 'home_visit_count_cache_ts_v1';
const COUNT_CACHE_TTL_MS = 30_000;

type UseHomeVisitCountResult = {
  count: number | null;
  isLoading: boolean;
  error: string | null;
};

function readCachedCount(): { count: number; isFresh: boolean } | null {
  try {
    const rawCount = sessionStorage.getItem(COUNT_CACHE_KEY);
    const rawTs = sessionStorage.getItem(COUNT_CACHE_TS_KEY);
    if (!rawCount || !rawTs) return null;

    const count = Number(rawCount);
    const ts = Number(rawTs);
    if (!Number.isFinite(count) || !Number.isFinite(ts)) return null;

    return { count, isFresh: Date.now() - ts < COUNT_CACHE_TTL_MS };
  } catch {
    // sessionStorage may be blocked in some hardened browser contexts.
    return null;
  }
}

function writeCachedCount(count: number) {
  try {
    sessionStorage.setItem(COUNT_CACHE_KEY, String(count));
    sessionStorage.setItem(COUNT_CACHE_TS_KEY, String(Date.now()));
  } catch {
    // Best-effort caching only.
  }
}

/**
 * Production-ready homepage visit counter:
 * - Counts ONE visit per *browser session* (sessionStorage gate; no localStorage).
 * - Stores minimal DB data (page + visited_at).
 * - Uses an RPC to fetch the count (no row reads, low bandwidth).
 */
export function useHomeVisitCount(): UseHomeVisitCountResult {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setIsLoading(true);
        setError(null);

        // Safety: Vite SSR isn't used here, but guard anyway.
        if (typeof window === 'undefined') return;

        const cached = readCachedCount();
        const alreadyVisited = sessionStorage.getItem(VISITED_HOME_KEY) === '1';

        // If we've already visited in this session and the cached count is fresh, skip the network call.
        if (alreadyVisited && cached?.isFresh) {
          if (!cancelled) setCount(cached.count);
          return;
        }

        let didInsert = false;
        if (!alreadyVisited) {
          // Insert ONLY when necessary. We let Postgres set visited_at (default now()).
          const { error: insertError } = await supabase
            .from('page_visits')
            .insert({ page: 'home' }, { returning: 'minimal' });

          if (insertError) throw insertError;
          sessionStorage.setItem(VISITED_HOME_KEY, '1');
          didInsert = true;
        }

        // Fetch total count via RPC (returns a single bigint/number; minimal bandwidth).
        // If we didn't insert and cache exists but is stale, we refresh.
        const { data, error: countError } = await supabase.rpc('get_page_visit_count', {
          p_page: 'home',
        });

        if (countError) throw countError;

        const nextCount = Number(data);
        if (!Number.isFinite(nextCount)) {
          throw new Error('Invalid count returned from get_page_visit_count');
        }

        if (!cancelled) setCount(nextCount);
        writeCachedCount(nextCount);

        // If we inserted, we intentionally refresh immediately so UI shows the new count.
        void didInsert;
      } catch (e: any) {
        // Keep the UI resilient: failures should not break the homepage.
        const message = typeof e?.message === 'string' ? e.message : 'Failed to load visit count';
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { count, isLoading, error };
}
