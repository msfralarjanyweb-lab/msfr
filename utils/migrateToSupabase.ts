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

    // حفظ بيانات الموقع في Supabase
    const { error: siteDataError } = await supabase
      .from('site_data')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        data: siteData,
        updated_at: new Date().toISOString(),
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

    // إضافة المقالات إلى Supabase
    if (articles && articles.length > 0) {
      const articlesToInsert = articles.map((article, index) => ({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content || '',
        date: article.date,
        category: article.category,
        image: article.image,
        display_order: index,
      }));

      const { error: articlesError } = await supabase
        .from('articles')
        .upsert(articlesToInsert, { onConflict: 'title' });

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

    // إضافة آراء العملاء إلى Supabase
    if (testimonials && testimonials.length > 0) {
      const testimonialsToInsert = testimonials.map((testimonial, index) => ({
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        image: testimonial.image,
        date: testimonial.date,
        display_order: index,
      }));

      const { error: testimonialsError } = await supabase
        .from('testimonials')
        .upsert(testimonialsToInsert, { onConflict: 'id' });

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

