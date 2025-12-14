import { createClient } from '@supabase/supabase-js';

// استخراج معلومات الاتصال من متغيرات البيئة
// يجب إضافة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في Netlify Environment Variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL غير موجود. يرجى إضافته في Netlify Environment Variables');
  throw new Error('VITE_SUPABASE_URL is required');
}

if (!SUPABASE_ANON_KEY) {
  console.error('❌ VITE_SUPABASE_ANON_KEY غير موجود. يرجى إضافته في Netlify Environment Variables');
  throw new Error('VITE_SUPABASE_ANON_KEY is required');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

