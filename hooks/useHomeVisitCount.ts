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

type UseHomeVisitCountOptions = {
  /**
   * When true, registers ONE homepage visit per browser session (HOME page should use this).
   * When false, never inserts (Admin page should use this).
   */
  registerVisit?: boolean;
  /**
   * When true, fetches the total visit count via RPC (Admin should use this).
   * When false, skips the count read to avoid unnecessary Supabase calls (Home can use this).
   */
  fetchCount?: boolean;
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
 * - Uses an RPC to fetch the count (no row reads, low bandwidth) when requested.
 */
export function useHomeVisitCount(options: UseHomeVisitCountOptions = {}): UseHomeVisitCountResult {
  const { registerVisit = true, fetchCount = true } = options;
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

        const cached = fetchCount ? readCachedCount() : null;
        const alreadyVisited = registerVisit ? sessionStorage.getItem(VISITED_HOME_KEY) === '1' : false;

        // If we only need the count (Admin) and cache is fresh, skip network.
        // If we already visited this session (Home) and cache is fresh, skip network too.
        if (fetchCount && cached?.isFresh && (alreadyVisited || !registerVisit)) {
          if (!cancelled) setCount(cached.count);
          return;
        }

        if (registerVisit && !alreadyVisited) {
          // Insert ONLY when necessary. We let Postgres set visited_at (default now()).
          const { error: insertError } = await supabase
            .from('page_visits')
            .insert({ page: 'home' }, { returning: 'minimal' });

          if (insertError) throw insertError;
          sessionStorage.setItem(VISITED_HOME_KEY, '1');
        }

        // Home page doesn't need to read the count (we display it in Admin only).
        if (!fetchCount) {
          return;
        }

        // Fetch total count via RPC (returns a single bigint/number; minimal bandwidth).
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
  }, [fetchCount, registerVisit]);

  return { count, isLoading, error };
}
