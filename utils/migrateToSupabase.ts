/**
 * أداة نقل البيانات من localStorage إلى Supabase
 * قم بتشغيل هذه الأداة مرة واحدة لنقل البيانات الموجودة
 */

import { supabase } from '../lib/supabase';
import { defaultData } from '../contexts/DataContext';
import { ARTICLES, TESTIMONIALS } from '../data/constants';

export async function migrateLocalStorageToSupabase() {
  try {
    console.log('🚀 بدء عملية نقل البيانات من localStorage إلى Supabase...');
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      throw new Error('يجب تسجيل الدخول كمسؤول قبل تشغيل أداة النقل (sessionToken غير موجود).');
    }

    // 1. نقل بيانات الموقع (siteData)
    const siteDataStr = localStorage.getItem('siteData');
    let siteData = defaultData;
    
    if (siteDataStr) {
      try {
        const parsed = JSON.parse(siteDataStr);
        siteData = { ...defaultData, ...parsed };
        console.log('✅ تم قراءة بيانات الموقع من localStorage');
      } catch (error) {
        console.warn('⚠️ خطأ في قراءة siteData من localStorage، سيتم استخدام البيانات الافتراضية');
      }
    }

    // حفظ بيانات الموقع في Supabase (عبر RPC لتفادي مشاكل RLS)
    const { error: siteDataError } = await supabase.rpc('admin_upsert_site_data', {
      p_session_token: sessionToken,
      p_id: '00000000-0000-0000-0000-000000000001',
      p_data: siteData,
    });

    if (siteDataError) {
      console.error('❌ خطأ في حفظ بيانات الموقع:', siteDataError);
    } else {
      console.log('✅ تم حفظ بيانات الموقع في Supabase');
    }

    // 2. نقل المقالات (articles)
    const articlesStr = localStorage.getItem('articles');
    let articles = ARTICLES;
    
    if (articlesStr) {
      try {
        articles = JSON.parse(articlesStr);
        console.log('✅ تم قراءة المقالات من localStorage');
      } catch (error) {
        console.warn('⚠️ خطأ في قراءة articles من localStorage، سيتم استخدام البيانات الافتراضية');
      }
    }

    // حذف المقالات القديمة (اختياري - يمكنك الاحتفاظ بها)
    // await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // إضافة المقالات إلى Supabase (عبر RPC لتفادي مشاكل RLS)
    if (articles && articles.length > 0) {
      let articlesError: any = null;
      for (const article of articles) {
        const { error } = await supabase.rpc('admin_insert_article', {
          p_session_token: sessionToken,
          p_title: article.title,
          p_excerpt: article.excerpt,
          p_content: article.content || '',
          p_date: article.date,
          p_category: article.category,
          p_image: article.image,
        });
        if (error) {
          articlesError = error;
          break;
        }
      }

      if (articlesError) {
        console.error('❌ خطأ في حفظ المقالات:', articlesError);
      } else {
        console.log(`✅ تم حفظ ${articles.length} مقال في Supabase`);
      }
    }

    // 3. نقل آراء العملاء (testimonials)
    const testimonialsStr = localStorage.getItem('testimonials');
    let testimonials = TESTIMONIALS;
    
    if (testimonialsStr) {
      try {
        testimonials = JSON.parse(testimonialsStr);
        console.log('✅ تم قراءة آراء العملاء من localStorage');
      } catch (error) {
        console.warn('⚠️ خطأ في قراءة testimonials من localStorage، سيتم استخدام البيانات الافتراضية');
      }
    }

    // إضافة آراء العملاء إلى Supabase (عبر RPC لتفادي مشاكل RLS)
    if (testimonials && testimonials.length > 0) {
      let testimonialsError: any = null;
      for (const testimonial of testimonials) {
        const { error } = await supabase.rpc('admin_insert_testimonial', {
          p_session_token: sessionToken,
          p_name: testimonial.name,
          p_role: testimonial.role,
          p_content: testimonial.content,
          p_image: testimonial.image,
          p_date: testimonial.date,
        });
        if (error) {
          testimonialsError = error;
          break;
        }
      }

      if (testimonialsError) {
        console.error('❌ خطأ في حفظ آراء العملاء:', testimonialsError);
      } else {
        console.log(`✅ تم حفظ ${testimonials.length} رأي عميل في Supabase`);
      }
    }

    console.log('✅ اكتملت عملية النقل بنجاح!');
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ عام في عملية النقل:', error);
    return { success: false, error };
  }
}

// دالة مساعدة لتشغيل النقل من وحدة التحكم
if (typeof window !== 'undefined') {
  (window as any).migrateToSupabase = migrateLocalStorageToSupabase;
  console.log('💡 يمكنك تشغيل migrateToSupabase() من وحدة التحكم لنقل البيانات');
}

