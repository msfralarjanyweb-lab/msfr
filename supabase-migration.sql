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

