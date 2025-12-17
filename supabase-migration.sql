-- ============================================
-- Supabase Database Migration Script
-- ============================================
-- قم بتنفيذ هذا السكريبت في Supabase SQL Editor
-- Dashboard > SQL Editor > New Query

-- 1. جدول المستخدمين (Authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء المستخدم الافتراضي (admin/admin123)
-- ملاحظة: في الإنتاج، يجب استخدام bcrypt لتشفير كلمات المرور
-- للتبسيط، نستخدم كلمة المرور مباشرة (سيتم التحقق منها في الكود)
-- يمكنك استخدام هذا الموقع لتوليد hash: https://bcrypt-generator.com/
INSERT INTO users (username, password_hash) 
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- 2. جدول بيانات الموقع (Site Data)
CREATE TABLE IF NOT EXISTS site_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء سجل افتراضي واحد
INSERT INTO site_data (id, data) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '{
    "meta": {
      "title": "شركة مسفر محمد العرجاني للمحاماة",
      "description": "خدمات قانونية متكاملة لرواد الأعمال والشركات والأفراد."
    },
    "hero": {
      "badge": "شركة محاماة رائدة",
      "title": "استخدم خبرتنا",
      "titleHighlight": "القانونية الفعالة",
      "description": "ندافع عن حقوقك ونساعدك على النجاح. فريقنا المتخصص يضمن لك أفضل تمثيل قانوني في كافة القضايا التجارية والشخصية.",
      "button1Text": "اطلب استشارة",
      "button2Text": "تعرف علينا",
      "image": "/images/lawyer.png",
      "lawyerName": "مسفر محمد العرجاني",
      "lawyerTitle1": "عضو اساسي في هيئة المحامين",
      "lawyerTitle2": "مسجل عيني للعقار"
    },
    "visibility": {
      "hero": true,
      "about": true,
      "services": true,
      "stats": true,
      "cta": true,
      "features": true,
      "testimonials": true,
      "videos": true,
      "news": true,
      "faq": true,
      "contact": true,
      "clients": true
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 3. جدول المقالات (Articles)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date);
CREATE INDEX IF NOT EXISTS idx_articles_display_order ON articles(display_order);

-- 4. جدول آراء العملاء (Testimonials)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);

-- إنشاء فهرس للترتيب
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- 5. جدول العملاء (Clients)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);

-- إنشاء فهرس للترتيب
CREATE INDEX IF NOT EXISTS idx_clients_display_order ON clients(display_order);

-- 6. جدول الفيديوهات (Videos)
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  duration TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);

-- إنشاء فهرس للترتيب
CREATE INDEX IF NOT EXISTS idx_videos_display_order ON videos(display_order);

-- 7. جدول جلسات المستخدمين (Sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- حذف الـ triggers الموجودة إن وجدت (للتشغيل المتكرر)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_site_data_updated_at ON site_data;
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;

-- إنشاء triggers لتحديث updated_at تلقائياً
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_data_updated_at BEFORE UPDATE ON site_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- تمكين Row Level Security (RLS) - اختياري
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- ملاحظة: يمكنك إنشاء policies لـ RLS حسب احتياجاتك

-- ============================================
-- 8. جدول زيارات الصفحات (Homepage Visitor Counter)
-- ============================================
-- هدف التصميم:
-- - تخزين أقل قدر ممكن من البيانات (page + visited_at فقط)
-- - العد يتم مرة واحدة لكل session في الواجهة (sessionStorage)
-- - تجنب كشف الصفوف للعامة: نستخدم RPC لإرجاع العدد فقط

-- امتداد uuid (غالباً متوفر في Supabase، لكن نضمنه للتشغيل المتكرر)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- فهرس بسيط لدعم count(*) مع filter على page
CREATE INDEX IF NOT EXISTS idx_page_visits_page ON public.page_visits(page);

-- حماية الجدول عبر RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- نقيد الإدخال على الصفحة الرئيسية فقط (لمنع إدخال صفحات عشوائية عبر المفتاح العام).
DROP POLICY IF EXISTS allow_insert_home_visits ON public.page_visits;
CREATE POLICY allow_insert_home_visits
  ON public.page_visits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (page = 'home');

-- قفل القراءة المباشرة للصفوف للعامة، والسماح فقط بالإدخال
REVOKE ALL ON TABLE public.page_visits FROM anon, authenticated;
GRANT INSERT ON TABLE public.page_visits TO anon, authenticated;

-- RPC لإرجاع عدد الزيارات بدون كشف الصفوف (تقليل bandwidth + تقليل surface area)
CREATE OR REPLACE FUNCTION public.get_page_visit_count(p_page TEXT)
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::BIGINT
  FROM public.page_visits
  WHERE page = p_page;
$$;

REVOKE ALL ON FUNCTION public.get_page_visit_count(TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_page_visit_count(TEXT) TO anon, authenticated;

-- ============================================
-- 9. RLS + RPC hardening (required for production)
-- ============================================
-- Why this section exists:
-- - This repository does NOT use Supabase Auth. It uses custom `users` + `user_sessions`.
-- - When RLS is enabled "everywhere", direct SELECT/INSERT/UPDATE on these tables breaks login
--   and may surface as "wrong password" in the UI.
-- - To keep RLS enabled AND keep the DB secure, we:
--   1) Allow PUBLIC READ on public content tables used by the homepage.
--   2) Deny DIRECT access to `users` and `user_sessions` (no table SELECT from the browser).
--   3) Expose only minimal SECURITY DEFINER RPC functions that validate `session_token`.
--
-- NOTE:
-- - SECURITY DEFINER functions run with the privileges of their owner (typically `postgres` in Supabase SQL editor),
--   and will bypass RLS unless FORCE ROW LEVEL SECURITY is enabled. We explicitly set NO FORCE on our app tables.
-- - We keep RLS enabled; we do NOT disable it globally.

-- --------
-- Safety: ensure RLS is not enabled on system auth.users (should remain managed by Supabase).
-- (If the auth schema/table doesn't exist in your environment, this block no-ops.)
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY';
  EXCEPTION
    WHEN undefined_table THEN
      NULL;
    WHEN insufficient_privilege THEN
      NULL;
  END;
END $$;

-- --------
-- Enable RLS on ALL app tables (idempotent).
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Ensure SECURITY DEFINER RPCs can operate even if FORCE RLS was toggled on.
ALTER TABLE public.users NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.site_data NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.articles NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.clients NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.videos NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.page_visits NO FORCE ROW LEVEL SECURITY;

-- --------
-- PUBLIC READ policies for public content.
-- These tables are rendered on the public website, so anon read access is required.
-- Writes are handled ONLY via admin RPCs (no direct INSERT/UPDATE/DELETE policies).
DROP POLICY IF EXISTS public_read_site_data ON public.site_data;
CREATE POLICY public_read_site_data
  ON public.site_data
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS public_read_articles ON public.articles;
CREATE POLICY public_read_articles
  ON public.articles
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS public_read_testimonials ON public.testimonials;
CREATE POLICY public_read_testimonials
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS public_read_clients ON public.clients;
CREATE POLICY public_read_clients
  ON public.clients
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS public_read_videos ON public.videos;
CREATE POLICY public_read_videos
  ON public.videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Explicit privileges: allow SELECT on public content, but deny direct writes.
REVOKE ALL ON TABLE public.site_data FROM anon, authenticated;
REVOKE ALL ON TABLE public.articles FROM anon, authenticated;
REVOKE ALL ON TABLE public.testimonials FROM anon, authenticated;
REVOKE ALL ON TABLE public.clients FROM anon, authenticated;
REVOKE ALL ON TABLE public.videos FROM anon, authenticated;
GRANT SELECT ON TABLE public.site_data TO anon, authenticated;
GRANT SELECT ON TABLE public.articles TO anon, authenticated;
GRANT SELECT ON TABLE public.testimonials TO anon, authenticated;
GRANT SELECT ON TABLE public.clients TO anon, authenticated;
GRANT SELECT ON TABLE public.videos TO anon, authenticated;

-- Lock down sensitive tables from the browser completely.
-- `users` contains credential material; `user_sessions` contains session tokens.
REVOKE ALL ON TABLE public.users FROM anon, authenticated;
REVOKE ALL ON TABLE public.user_sessions FROM anon, authenticated;

-- --------
-- Admin/session RPC helpers.
-- IMPORTANT: These RPCs are the ONLY way the frontend should authenticate and mutate content.
-- They validate the custom `session_token` stored by the UI.

-- Validate session token and return user_id (NULL if invalid).
CREATE OR REPLACE FUNCTION public.validate_session(p_session_token TEXT)
RETURNS TABLE(is_valid BOOLEAN, user_id UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (s.id IS NOT NULL) AS is_valid,
    s.user_id
  FROM (
    SELECT user_id, id
    FROM public.user_sessions
    WHERE session_token = p_session_token
      AND expires_at > NOW()
    LIMIT 1
  ) s;
$$;

-- Login using the legacy `users` table (plain-text password_hash in this repo's schema).
-- Returns a freshly created session token + expiry.
CREATE OR REPLACE FUNCTION public.login_with_password(p_username TEXT, p_password TEXT)
RETURNS TABLE(session_token TEXT, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_stored TEXT;
  v_token TEXT;
  v_expires TIMESTAMPTZ;
BEGIN
  SELECT id, password_hash
    INTO v_user_id, v_stored
  FROM public.users
  WHERE username = p_username;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'invalid_credentials' USING ERRCODE = 'P0001';
  END IF;

  -- NOTE: This repo currently stores a plain string in `password_hash` (see `supabase-migration.sql` seed).
  -- If you upgrade to bcrypt in the future, replace this comparison accordingly.
  IF v_stored IS NULL OR v_stored <> p_password THEN
    RAISE EXCEPTION 'invalid_credentials' USING ERRCODE = 'P0001';
  END IF;

  v_token := encode(gen_random_bytes(32), 'hex');
  v_expires := NOW() + INTERVAL '24 hours';

  INSERT INTO public.user_sessions(user_id, session_token, expires_at)
  VALUES (v_user_id, v_token, v_expires);

  RETURN QUERY SELECT v_token, v_expires;
END;
$$;

-- Logout: delete the session token (best-effort, idempotent).
CREATE OR REPLACE FUNCTION public.logout_session(p_session_token TEXT)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.user_sessions
  WHERE session_token = p_session_token;
$$;

-- Change password for the session user, then revoke all sessions (forces re-login everywhere).
CREATE OR REPLACE FUNCTION public.change_password_with_session(
  p_session_token TEXT,
  p_current_password TEXT,
  p_new_password TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_stored TEXT;
BEGIN
  SELECT s.user_id INTO v_user_id
  FROM public.user_sessions s
  WHERE s.session_token = p_session_token
    AND s.expires_at > NOW();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'invalid_session' USING ERRCODE = 'P0001';
  END IF;

  SELECT u.password_hash INTO v_stored
  FROM public.users u
  WHERE u.id = v_user_id;

  IF v_stored IS NULL OR v_stored <> p_current_password THEN
    RAISE EXCEPTION 'invalid_current_password' USING ERRCODE = 'P0001';
  END IF;

  IF p_new_password IS NULL OR length(p_new_password) < 6 THEN
    RAISE EXCEPTION 'password_too_short' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.users
  SET password_hash = p_new_password,
      updated_at = NOW()
  WHERE id = v_user_id;

  -- Revoke all existing sessions (including the current one).
  DELETE FROM public.user_sessions
  WHERE user_id = v_user_id;
END;
$$;

-- Helper used by admin RPCs to require a valid session.
CREATE OR REPLACE FUNCTION public.require_admin_session(p_session_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT s.user_id INTO v_user_id
  FROM public.user_sessions s
  WHERE s.session_token = p_session_token
    AND s.expires_at > NOW();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'invalid_session' USING ERRCODE = 'P0001';
  END IF;

  RETURN v_user_id;
END;
$$;

-- Admin upsert for the single site_data row used by the frontend.
CREATE OR REPLACE FUNCTION public.admin_upsert_site_data(
  p_session_token TEXT,
  p_id UUID,
  p_data JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.require_admin_session(p_session_token);

  -- This app expects a SINGLE canonical row.
  IF p_id <> '00000000-0000-0000-0000-000000000001'::uuid THEN
    RAISE EXCEPTION 'invalid_site_data_id' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.site_data(id, data)
  VALUES (p_id, COALESCE(p_data, '{}'::jsonb))
  ON CONFLICT (id) DO UPDATE
    SET data = EXCLUDED.data,
        updated_at = NOW();
END;
$$;

-- Admin CRUD: articles
CREATE OR REPLACE FUNCTION public.admin_insert_article(
  p_session_token TEXT,
  p_title TEXT,
  p_excerpt TEXT,
  p_content TEXT,
  p_date TEXT,
  p_category TEXT,
  p_image TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  INSERT INTO public.articles(title, excerpt, content, date, category, image)
  VALUES (p_title, p_excerpt, p_content, p_date, p_category, p_image)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_article(
  p_session_token TEXT,
  p_id UUID,
  p_title TEXT,
  p_excerpt TEXT,
  p_content TEXT,
  p_date TEXT,
  p_category TEXT,
  p_image TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  UPDATE public.articles
  SET title = p_title,
      excerpt = p_excerpt,
      content = p_content,
      date = p_date,
      category = p_category,
      image = p_image,
      updated_at = NOW()
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_article(
  p_session_token TEXT,
  p_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  DELETE FROM public.articles WHERE id = p_id;
END;
$$;

-- Admin CRUD: testimonials
CREATE OR REPLACE FUNCTION public.admin_insert_testimonial(
  p_session_token TEXT,
  p_name TEXT,
  p_role TEXT,
  p_content TEXT,
  p_image TEXT,
  p_date TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  INSERT INTO public.testimonials(name, role, content, image, date)
  VALUES (p_name, p_role, p_content, p_image, p_date)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_testimonial(
  p_session_token TEXT,
  p_id UUID,
  p_name TEXT,
  p_role TEXT,
  p_content TEXT,
  p_image TEXT,
  p_date TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  UPDATE public.testimonials
  SET name = p_name,
      role = p_role,
      content = p_content,
      image = p_image,
      date = p_date,
      updated_at = NOW()
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_testimonial(
  p_session_token TEXT,
  p_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  DELETE FROM public.testimonials WHERE id = p_id;
END;
$$;

-- Admin CRUD: clients
CREATE OR REPLACE FUNCTION public.admin_insert_client(
  p_session_token TEXT,
  p_name TEXT,
  p_logo TEXT,
  p_display_order INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  INSERT INTO public.clients(name, logo, display_order)
  VALUES (p_name, p_logo, COALESCE(p_display_order, 0))
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_client(
  p_session_token TEXT,
  p_id UUID,
  p_name TEXT,
  p_logo TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  UPDATE public.clients
  SET name = p_name,
      logo = p_logo,
      updated_at = NOW()
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_client(
  p_session_token TEXT,
  p_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  DELETE FROM public.clients WHERE id = p_id;
END;
$$;

-- Admin CRUD: videos
CREATE OR REPLACE FUNCTION public.admin_insert_video(
  p_session_token TEXT,
  p_title TEXT,
  p_thumbnail TEXT,
  p_duration TEXT,
  p_url TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  INSERT INTO public.videos(title, thumbnail, duration, url)
  VALUES (p_title, p_thumbnail, COALESCE(p_duration, ''), p_url)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_video(
  p_session_token TEXT,
  p_id UUID,
  p_title TEXT,
  p_thumbnail TEXT,
  p_duration TEXT,
  p_url TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  UPDATE public.videos
  SET title = p_title,
      thumbnail = p_thumbnail,
      duration = COALESCE(p_duration, ''),
      url = p_url,
      updated_at = NOW()
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_video(
  p_session_token TEXT,
  p_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.require_admin_session(p_session_token);
  DELETE FROM public.videos WHERE id = p_id;
END;
$$;

-- Allow the frontend (anon/authenticated) to call the RPCs.
REVOKE ALL ON FUNCTION public.validate_session(TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.login_with_password(TEXT, TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.logout_session(TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.change_password_with_session(TEXT, TEXT, TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.require_admin_session(TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_upsert_site_data(TEXT, UUID, JSONB) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_insert_article(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_update_article(TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_delete_article(TEXT, UUID) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_insert_testimonial(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_update_testimonial(TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_delete_testimonial(TEXT, UUID) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_insert_client(TEXT, TEXT, TEXT, INTEGER) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_update_client(TEXT, UUID, TEXT, TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_delete_client(TEXT, UUID) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_insert_video(TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_update_video(TEXT, UUID, TEXT, TEXT, TEXT, TEXT) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_delete_video(TEXT, UUID) FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION public.validate_session(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.logout_session(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.change_password_with_session(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.require_admin_session(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_site_data(TEXT, UUID, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_insert_article(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_article(TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_article(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_insert_testimonial(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_testimonial(TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_testimonial(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_insert_client(TEXT, TEXT, TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_client(TEXT, UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_client(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_insert_video(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_video(TEXT, UUID, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_video(TEXT, UUID) TO anon, authenticated;

