import { createClient } from '@supabase/supabase-js';

// استخراج معلومات الاتصال من متغيرات البيئة
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rnwajknqcyjwwujxtaoq.supabase.co';
// يجب الحصول على anon key من Supabase Dashboard > Settings > API
// يمكنك أيضاً استخدام service_role key للعمليات الإدارية (احذر من استخدامه في الكود الأمامي)
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL) {
  console.warn('⚠️ VITE_SUPABASE_URL غير موجود. يرجى إضافته في ملف .env');
}

if (!SUPABASE_ANON_KEY) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY غير موجود. يرجى إضافته في ملف .env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

