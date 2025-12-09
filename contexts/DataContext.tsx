import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { 
  SERVICES, FEATURES, TESTIMONIALS, FAQ_ITEMS, ARTICLES, FALLBACK_VIDEOS 
} from '../data/constants';
import { Service, Feature, Testimonial, FAQItem, Article, VideoItem } from '../types';

interface SectionVisibility {
  hero: boolean;
  about: boolean;
  services: boolean;
  stats: boolean;
  cta: boolean;
  features: boolean;
  testimonials: boolean;
  videos: boolean;
  news: boolean;
  faq: boolean;
  contact: boolean;
}

interface SiteData {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    button1Text: string;
    button2Text: string;
    image: string;
    lawyerName: string;
    lawyerTitle1: string;
    lawyerTitle2: string;
  };
  about: {
    subtitle: string;
    title: string;
    description: string;
    image: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
  services: {
    subtitle: string;
    title: string;
    description: string;
    items: Service[];
  };
  stats: {
    clients: string;
    compensation: string;
    experience: string;
    successRate: string;
    title: string;
    description: string;
    image: string;
  };
  cta: {
    subtitle: string;
    title: string;
    description: string;
    phone: string;
    buttonText: string;
  };
  features: {
    subtitle: string;
    title: string;
    description: string;
    items: Feature[];
  };
  testimonials: {
    subtitle: string;
    title: string;
    description: string;
    items: Testimonial[];
  };
  videos: {
    subtitle: string;
    title: string;
    description: string;
    items: VideoItem[];
  };
  news: {
    subtitle: string;
    title: string;
    description: string;
    items: Article[];
  };
  faq: {
    subtitle: string;
    title: string;
    description: string;
    items: FAQItem[];
  };
  contact: {
    subtitle: string;
    title: string;
    description: string;
    address: string;
    phone: string;
    email: string;
  };
  visibility: SectionVisibility;
}

export const defaultData: SiteData = {
  hero: {
    badge: 'شركة محاماة رائدة',
    title: 'استخدم خبرتنا',
    titleHighlight: 'القانونية الفعالة',
    description: 'ندافع عن حقوقك ونساعدك على النجاح. فريقنا المتخصص يضمن لك أفضل تمثيل قانوني في كافة القضايا التجارية والشخصية.',
    button1Text: 'اطلب استشارة',
    button2Text: 'تعرف علينا',
    image: '/images/lawyer.png',
    lawyerName: 'مسفر محمد العرجاني',
    lawyerTitle1: 'عضو اساسي في هيئة المحامين',
    lawyerTitle2: 'مسجل عيني للعقار',
  },
  about: {
    subtitle: 'عن شركة مسفر محمد العرجاني',
    title: 'خبرة قانونية راسخة عبر سنوات من الممارسة',
    description: 'مكتبنا للمحاماة محترف ومكرس لمساعدة العملاء على حل المشكلات وتحقيق الأهداف. نقدم مجموعة كاملة من الخدمات للتعامل مع القضايا القانونية من أي تعقيد للأفراد والشركات والمنظمات الكبيرة.',
    image: '/images/lawyer2.png',
    features: [
      {
        title: 'رفع القضايا وكتابة المذكرات القانونية وحضور الجلسات',
        description: 'نقدم خدمات رفع القضايا وكتابة المذكرات القانونية وحضور الجلسات للأفراد والشركات والمنظمات الكبيرة.',
      },
      {
        title: 'استشارات قانونية ودراسة المستندات والعقود',
        description: 'نقدم خدمات استشارات قانونية ودراسة المستندات والعقود للأفراد والشركات والمنظمات الكبيرة.',
      },
    ],
  },
  services: {
    subtitle: 'كيف يمكننا مساعدتك',
    title: 'منظومة خدماتنا القانونية',
    description: 'مهما كانت قضيتك، يمكننا مساعدتك فيها بفضل خبرتنا الواسعة.',
    items: SERVICES,
  },
  stats: {
    clients: '978',
    compensation: '66 M',
    experience: '25',
    successRate: '99%',
    title: 'نقدم حلولاً فعالة آمنة ومستدامة.',
    description: 'القانون في صفك، ثق بنا! سيقوم فريق المحامين ذوي الخبرة لدينا بإثبات ذلك ومساعدتك على النجاح في قضيتك.',
    image: '/images/lawyer3.png',
  },
  cta: {
    subtitle: 'استشارة',
    title: 'احصل على استشارة مجانية!',
    description: 'سندرس حالتك مجاناً ونساعدك على النجاح. اتصل بنا اليوم لتبدأ الخطوة الأولى.',
    phone: '+966509579993',
    buttonText: 'أرسل طلباً',
  },
  features: {
    subtitle: 'لماذا تختارنا',
    title: 'أهم المميزات',
    description: 'إليك بضعة أسباب فقط للعمل مع شركة مسفر محمد العرجاني للمحاماة والاستشارات.',
    items: FEATURES,
  },
  testimonials: {
    subtitle: 'آراء العملاء',
    title: 'ماذا يقول عملاؤنا',
    description: 'نعتز بثقة عملائنا ونسعى دائماً لتحقيق أفضل النتائج لهم.',
    items: TESTIMONIALS,
  },
  videos: {
    subtitle: 'المكتبة المرئية',
    title: 'فيديوهات توعوية وقانونية',
    description: 'تابع أحدث الشروحات القانونية والأخبار عبر قنواتنا على وسائل التواصل الاجتماعي.',
    items: FALLBACK_VIDEOS,
  },
  news: {
    subtitle: 'الأخبار',
    title: 'اقرأ مقالاتنا',
    description: 'في مدونتنا، نناقش أحدث القضايا والتحليلات القانونية في المملكة.',
    items: ARTICLES,
  },
  faq: {
    subtitle: 'الأسئلة الشائعة',
    title: 'هل لا يزال لديك أي أسئلة؟',
    description: 'فيما يلي الإجابات على الأسئلة الأكثر شيوعاً التي تردنا من العملاء:',
    items: FAQ_ITEMS,
  },
  contact: {
    subtitle: 'اتصل بنا',
    title: 'نحن هنا لمساعدتك',
    description: 'تواصل معنا اليوم واحصل على استشارة قانونية مجانية',
    address: 'طريق الملك فهد، الرياض، المملكة العربية السعودية',
    phone: '+966509579993',
    email: 'info@al-arjani-law.com',
  },
  visibility: {
    hero: true,
    about: true,
    services: true,
    stats: true,
    cta: true,
    features: true,
    testimonials: true,
    videos: true,
    news: true,
    faq: true,
    contact: true,
  },
};

interface DataContextType {
  data: SiteData;
  updateSection: <K extends keyof SiteData>(section: K, data: Partial<SiteData[K]>) => Promise<void>;
  toggleSectionVisibility: (section: keyof SectionVisibility) => Promise<void>;
  articles: Article[];
  addArticle: (article: Article) => Promise<void>;
  updateArticle: (index: number, article: Article) => Promise<void>;
  deleteArticle: (index: number) => Promise<void>;
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Testimonial) => Promise<void>;
  updateTestimonial: (index: number, testimonial: Testimonial) => Promise<void>;
  deleteTestimonial: (index: number) => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const SITE_DATA_ID = '00000000-0000-0000-0000-000000000001';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(defaultData);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // تحميل البيانات من Supabase عند بدء التطبيق
  useEffect(() => {
    loadDataFromSupabase();
  }, []);

  const loadDataFromSupabase = async () => {
    try {
      setIsLoading(true);

      // تحميل بيانات الموقع
      const { data: siteDataRecord, error: siteDataError } = await supabase
        .from('site_data')
        .select('data')
        .eq('id', SITE_DATA_ID)
        .single();

      if (!siteDataError && siteDataRecord?.data) {
        const mergedData = {
          ...defaultData,
          ...siteDataRecord.data,
          visibility: {
            ...defaultData.visibility,
            ...(siteDataRecord.data.visibility || {}),
          },
        };
        setData(mergedData);
      } else {
        // إذا لم توجد بيانات، إنشاء سجل افتراضي
        await supabase
          .from('site_data')
          .upsert({
            id: SITE_DATA_ID,
            data: defaultData,
          });
      }

      // تحميل المقالات
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .order('display_order', { ascending: true });

      if (!articlesError && articlesData && articlesData.length > 0) {
        const formattedArticles: Article[] = articlesData.map((item: any) => ({
          title: item.title,
          excerpt: item.excerpt,
          content: item.content || '',
          date: item.date,
          category: item.category,
          image: item.image,
        }));
        setArticles(formattedArticles);
        
        // تحديث قسم الأخبار
        setData(prev => ({
          ...prev,
          news: {
            ...prev.news,
            items: formattedArticles,
          },
        }));
      }

      // تحميل آراء العملاء
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (!testimonialsError && testimonialsData && testimonialsData.length > 0) {
        const formattedTestimonials: Testimonial[] = testimonialsData.map((item: any) => ({
          name: item.name,
          role: item.role,
          content: item.content,
          image: item.image,
          date: item.date,
        }));
        setTestimonials(formattedTestimonials);
        
        // تحديث قسم آراء العملاء
        setData(prev => ({
          ...prev,
          testimonials: {
            ...prev.testimonials,
            items: formattedTestimonials,
          },
        }));
      }
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // حفظ بيانات الموقع في Supabase
  const saveSiteDataToSupabase = async (siteData: SiteData) => {
    try {
      const { error } = await supabase
        .from('site_data')
        .upsert({
          id: SITE_DATA_ID,
          data: siteData,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving site data to Supabase:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in saveSiteDataToSupabase:', error);
      throw error;
    }
  };

  const updateSection = async <K extends keyof SiteData>(section: K, newData: Partial<SiteData[K]>) => {
    try {
      const updatedData = {
        ...data,
        [section]: {
          ...data[section],
          ...newData,
        },
      } as SiteData;

      setData(updatedData);
      await saveSiteDataToSupabase(updatedData);
    } catch (error) {
      console.error('Error updating section:', error);
      // إعادة تحميل البيانات في حالة الخطأ
      await loadDataFromSupabase();
    }
  };

  const toggleSectionVisibility = async (section: keyof SectionVisibility) => {
    try {
      const updatedData = {
        ...data,
        visibility: {
          ...data.visibility,
          [section]: !data.visibility[section],
        },
      };

      setData(updatedData);
      await saveSiteDataToSupabase(updatedData);
    } catch (error) {
      console.error('Error toggling section visibility:', error);
      await loadDataFromSupabase();
    }
  };

  const addArticle = async (article: Article) => {
    try {
      const { data: newArticle, error } = await supabase
        .from('articles')
        .insert({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content || '',
          date: article.date,
          category: article.category,
          image: article.image,
          display_order: articles.length,
        })
        .select()
        .single();

      if (error) throw error;

      const updatedArticles = [...articles, article];
      setArticles(updatedArticles);
      
      setData(prev => ({
        ...prev,
        news: {
          ...prev.news,
          items: updatedArticles,
        },
      }));
    } catch (error) {
      console.error('Error adding article:', error);
      throw error;
    }
  };

  const updateArticle = async (index: number, article: Article) => {
    try {
      // الحصول على ID المقال من قاعدة البيانات
      const { data: articlesData } = await supabase
        .from('articles')
        .select('id')
        .order('display_order', { ascending: true });

      if (!articlesData || !articlesData[index]) {
        throw new Error('Article not found');
      }

      const articleId = articlesData[index].id;

      const { error } = await supabase
        .from('articles')
        .update({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content || '',
          date: article.date,
          category: article.category,
          image: article.image,
        })
        .eq('id', articleId);

      if (error) throw error;

      const updated = [...articles];
      updated[index] = article;
      setArticles(updated);
      
      setData(prev => ({
        ...prev,
        news: {
          ...prev.news,
          items: updated,
        },
      }));
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  };

  const deleteArticle = async (index: number) => {
    try {
      // الحصول على ID المقال من قاعدة البيانات
      const { data: articlesData } = await supabase
        .from('articles')
        .select('id')
        .order('display_order', { ascending: true });

      if (!articlesData || !articlesData[index]) {
        throw new Error('Article not found');
      }

      const articleId = articlesData[index].id;

      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      const updated = articles.filter((_, i) => i !== index);
      setArticles(updated);
      
      setData(prev => ({
        ...prev,
        news: {
          ...prev.news,
          items: updated,
        },
      }));
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  };

  const addTestimonial = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          image: testimonial.image,
          date: testimonial.date,
          display_order: testimonials.length,
        });

      if (error) throw error;

      const updated = [...testimonials, testimonial];
      setTestimonials(updated);
      
      setData(prev => ({
        ...prev,
        testimonials: {
          ...prev.testimonials,
          items: updated,
        },
      }));
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw error;
    }
  };

  const updateTestimonial = async (index: number, testimonial: Testimonial) => {
    try {
      // الحصول على ID الرأي من قاعدة البيانات
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('id')
        .order('display_order', { ascending: true });

      if (!testimonialsData || !testimonialsData[index]) {
        throw new Error('Testimonial not found');
      }

      const testimonialId = testimonialsData[index].id;

      const { error } = await supabase
        .from('testimonials')
        .update({
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          image: testimonial.image,
          date: testimonial.date,
        })
        .eq('id', testimonialId);

      if (error) throw error;

      const updated = [...testimonials];
      updated[index] = testimonial;
      setTestimonials(updated);
      
      setData(prev => ({
        ...prev,
        testimonials: {
          ...prev.testimonials,
          items: updated,
        },
      }));
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
  };

  const deleteTestimonial = async (index: number) => {
    try {
      // الحصول على ID الرأي من قاعدة البيانات
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('id')
        .order('display_order', { ascending: true });

      if (!testimonialsData || !testimonialsData[index]) {
        throw new Error('Testimonial not found');
      }

      const testimonialId = testimonialsData[index].id;

      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) throw error;

      const updated = testimonials.filter((_, i) => i !== index);
      setTestimonials(updated);
      
      setData(prev => ({
        ...prev,
        testimonials: {
          ...prev.testimonials,
          items: updated,
        },
      }));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        updateSection,
        toggleSectionVisibility,
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    console.error('useData must be used within DataProvider');
    return {
      data: defaultData,
      updateSection: async () => {
        console.warn('updateSection called outside DataProvider');
      },
      toggleSectionVisibility: async () => {
        console.warn('toggleSectionVisibility called outside DataProvider');
      },
      articles: ARTICLES,
      addArticle: async () => {
        console.warn('addArticle called outside DataProvider');
      },
      updateArticle: async () => {
        console.warn('updateArticle called outside DataProvider');
      },
      deleteArticle: async () => {
        console.warn('deleteArticle called outside DataProvider');
      },
      testimonials: TESTIMONIALS,
      addTestimonial: async () => {
        console.warn('addTestimonial called outside DataProvider');
      },
      updateTestimonial: async () => {
        console.warn('updateTestimonial called outside DataProvider');
      },
      deleteTestimonial: async () => {
        console.warn('deleteTestimonial called outside DataProvider');
      },
      isLoading: false,
    };
  }
  
  if (!context.data || !context.data.visibility) {
    console.warn('Invalid context data, returning defaults');
    return {
      ...context,
      data: defaultData,
      articles: context.articles || ARTICLES,
      testimonials: context.testimonials || TESTIMONIALS,
    };
  }
  
  return context;
};
