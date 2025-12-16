import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Settings, FileText, Eye, EyeOff, Home, Layout, 
  Users, MessageSquare, Video, Newspaper, HelpCircle, 
  Mail, Save, Plus, Edit, Trash2, X, Image as ImageIcon, LogOut, Star, Upload, Lock, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Article, Testimonial, Client, VideoItem } from '../types';
import { getVideoThumbnail, getVideoInfo, detectVideoPlatform } from '../utils/videoThumbnail';
import { FEATURES } from '../data/constants';
import { supabase } from '../lib/supabase';

type AdminTab = 'sections' | 'articles' | 'testimonials' | 'clients' | 'videos' | 'password';

type NotificationType = 'success' | 'error';

interface AdminNotification {
  id: number;
  message: string;
  type: NotificationType;
}

// دالة مساعدة للحصول على تاريخ اليوم بصيغة عربية (ميلادي)
const getTodayDate = (): string => {
  return new Date().toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', calendar: 'gregory' });
};

const Admin: React.FC = () => {
  const { data, updateSection, toggleSectionVisibility, articles, addArticle, updateArticle, deleteArticle, testimonials, addTestimonial, updateTestimonial, deleteTestimonial, clients, addClient, updateClient, deleteClient, videos, addVideo, updateVideo, deleteVideo } = useData();
  const { logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const [humanVisitCount, setHumanVisitCount] = useState<number | null>(null);
  const [botVisitCount, setBotVisitCount] = useState<number | null>(null);
  const [isVisitCountsLoading, setIsVisitCountsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<number | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<number | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    content: '',
    date: getTodayDate(),
    category: 'أخبار',
    image: '',
  });
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    content: '',
    image: '',
    date: getTodayDate(),
  });
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    logo: '',
  });
  const [editingVideo, setEditingVideo] = useState<number | null>(null);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideo, setNewVideo] = useState<Partial<VideoItem>>({
    title: '',
    thumbnail: '',
    url: '',
  });
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const notificationTimeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    if (notificationTimeouts.current[id]) {
      clearTimeout(notificationTimeouts.current[id]);
      delete notificationTimeouts.current[id];
    }
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);

    const timeoutId = setTimeout(() => {
      removeNotification(id);
    }, 4500);

    notificationTimeouts.current[id] = timeoutId;
  }, [removeNotification]);

  useEffect(() => {
    let cancelled = false;

    const loadVisitCounts = async () => {
      setIsVisitCountsLoading(true);
      try {
        const [humanResult, botResult] = await Promise.all([
          supabase.from('page_visits').select('*', { count: 'exact', head: true }).eq('is_bot', false),
          supabase.from('page_visits').select('*', { count: 'exact', head: true }).eq('is_bot', true),
        ]);

        if (humanResult.error) throw humanResult.error;
        if (botResult.error) throw botResult.error;

        if (!cancelled) {
          setHumanVisitCount(typeof humanResult.count === 'number' ? humanResult.count : 0);
          setBotVisitCount(typeof botResult.count === 'number' ? botResult.count : 0);
        }
      } catch (error) {
        console.error('Error loading visit counts:', error);
        if (!cancelled) {
          setHumanVisitCount(null);
          setBotVisitCount(null);
        }
      } finally {
        if (!cancelled) setIsVisitCountsLoading(false);
      }
    };

    void loadVisitCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(notificationTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      logout();
      navigate('/login');
    }
  };

  const sections = [
    { id: 'hero', name: 'قسم البطل الرئيسي', icon: Home },
    { id: 'about', name: 'قسم من نحن', icon: Users },
    { id: 'services', name: 'قسم الخدمات', icon: Layout },
    { id: 'stats', name: 'قسم الإحصائيات', icon: Users },
    { id: 'cta', name: 'قسم الدعوة للعمل', icon: MessageSquare },
    { id: 'features', name: 'قسم المميزات', icon: Settings },
    { id: 'testimonials', name: 'قسم آراء العملاء', icon: MessageSquare },
    { id: 'clients', name: 'قسم عملاؤنا', icon: Users },
    { id: 'videos', name: 'قسم الفيديوهات', icon: Video },
    { id: 'news', name: 'قسم الأخبار', icon: Newspaper },
    { id: 'faq', name: 'قسم الأسئلة الشائعة', icon: HelpCircle },
    { id: 'contact', name: 'قسم الاتصال', icon: Mail },
  ];

  const dashboardCards: Array<{ id: AdminTab; title: string; description: string; icon: React.ElementType }> = [
    {
      id: 'sections',
      title: 'إدارة الأقسام',
      description: 'تحكم في إظهار أقسام الصفحة الرئيسية وتفعيلها أو تعديلها.',
      icon: Layout,
    },
    {
      id: 'articles',
      title: 'إدارة المقالات',
      description: 'أضف وحرر المقالات والصور المرتبطة بها من مكان واحد.',
      icon: FileText,
    },
    {
      id: 'testimonials',
      title: 'آراء العملاء',
      description: 'إدارة شهادات العملاء وإبراز أفضل قصص النجاح.',
      icon: Star,
    },
    {
      id: 'clients',
      title: 'عملاؤنا',
      description: 'إدارة قائمة العملاء وعرض شعارات الشركات.',
      icon: Users,
    },
    {
      id: 'videos',
      title: 'المكتبة المرئية',
      description: 'إدارة الفيديوهات وإضافة روابط الفيديو يدوياً.',
      icon: Video,
    },
    {
      id: 'password',
      title: 'تغيير كلمة المرور',
      description: 'حافظ على أمان الحساب بتحديث بيانات الدخول بسهولة.',
      icon: Lock,
    },
  ];

  const handleCardSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleToggleSectionVisibility = async (
    sectionId: keyof typeof data.visibility,
    sectionName: string,
    currentlyVisible: boolean
  ) => {
    try {
      await toggleSectionVisibility(sectionId);
      showNotification(
        currentlyVisible ? `تم تعطيل ${sectionName}` : `تم تفعيل ${sectionName}`
      );
    } catch (error) {
      console.error('Error toggling section visibility:', error);
      showNotification('حدث خطأ أثناء تحديث حالة القسم. يرجى المحاولة مرة أخرى.', 'error');
    }
  };

  const handleSaveSection = async (sectionId: string, formData: any, sectionName?: string) => {
    try {
      await updateSection(sectionId as keyof typeof data, formData);
      setEditingSection(null);
      showNotification(sectionName ? `تم حفظ ${sectionName} بنجاح` : 'تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Error saving section:', error);
      showNotification('حدث خطأ أثناء حفظ التغييرات. يرجى المحاولة مرة أخرى.', 'error');
    }
  };

  const handleSaveArticle = async () => {
    try {
      const articleToSave = {
        ...newArticle,
        image: newArticle.image?.trim() || '/images/article.png',
      } as Article;
      const isEditing = editingArticle !== null;
      
      if (isEditing) {
        await updateArticle(editingArticle, articleToSave);
      } else {
        await addArticle(articleToSave);
      }
      
      // إعادة تعيين الحقول بعد الحفظ
      setNewArticle({
        title: '',
        excerpt: '',
        content: '',
        date: getTodayDate(),
        category: 'أخبار',
        image: '',
      });
      setEditingArticle(null);
      showNotification(isEditing ? 'تم تحديث المقال بنجاح' : 'تم إضافة مقال بنجاح');
    } catch (error) {
      console.error('Error saving article:', error);
      showNotification('حدث خطأ أثناء حفظ المقال. يرجى المحاولة مرة أخرى.', 'error');
    }
  };

  const handleSaveTestimonial = async () => {
    try {
      const testimonialToSave = {
        ...newTestimonial,
        image: newTestimonial.image?.trim() || '/images/client.png',
      } as Testimonial;
      const isEditing = editingTestimonial !== null;
      
      if (isEditing) {
        await updateTestimonial(editingTestimonial, testimonialToSave);
      } else {
        await addTestimonial(testimonialToSave);
      }
      
      // إعادة تعيين الحقول بعد الحفظ
      setNewTestimonial({
        name: '',
        role: '',
        content: '',
        image: '',
        date: getTodayDate(),
      });
      setEditingTestimonial(null);
      showNotification(isEditing ? 'تم تحديث رأي العميل بنجاح' : 'تم إضافة رأي عميل جديد بنجاح');
    } catch (error) {
      console.error('Error saving testimonial:', error);
      showNotification('حدث خطأ أثناء حفظ رأي العميل. يرجى المحاولة مرة أخرى.', 'error');
    }
  };

  const handleSaveClient = async () => {
    try {
      const clientToSave = {
        ...newClient,
        logo: newClient.logo?.trim() || '/images/service.png',
      } as Client;
      const isEditing = editingClient !== null;
      
      if (isEditing) {
        await updateClient(editingClient, clientToSave);
      } else {
        await addClient(clientToSave);
      }
      
      // إعادة تعيين الحقول بعد الحفظ
      setNewClient({
        name: '',
        logo: '',
      });
      setEditingClient(null);
      setIsAddingClient(false);
      showNotification(isEditing ? 'تم تحديث العميل بنجاح' : 'تم إضافة عميل جديد بنجاح');
    } catch (error) {
      console.error('Error saving client:', error);
      showNotification('حدث خطأ أثناء حفظ العميل. يرجى المحاولة مرة أخرى.', 'error');
    }
  };

  const handleSaveVideo = async () => {
    try {
      const videoToSave = {
        ...newVideo,
        thumbnail: newVideo.thumbnail?.trim() || '/images/service.png',
        duration: '', // إزالة المدة من الواجهة
        url: newVideo.url?.trim() || '',
      } as VideoItem;
      
      // التحقق من أن الحقول المطلوبة موجودة
      if (!videoToSave.title || !videoToSave.url) {
        showNotification('يرجى إدخال عنوان الفيديو ورابط الفيديو', 'error');
        return;
      }
      
      // التحقق من أننا في وضع التعديل
      // نستخدم isAddingVideo للتأكد من أننا لسنا في وضع الإضافة
      // ونتحقق من أن editingVideo صحيح وأنه ضمن نطاق الفيديوهات الموجودة
      const isEditing = !isAddingVideo && editingVideo !== null && editingVideo >= 0 && editingVideo < videos.length;
      
      if (isEditing) {
        await updateVideo(editingVideo, videoToSave);
        showNotification('تم تحديث الفيديو بنجاح');
      } else {
        await addVideo(videoToSave);
        showNotification('تم إضافة فيديو جديد بنجاح');
      }
      
      // إعادة تعيين الحقول بعد الحفظ
      setNewVideo({
        title: '',
        thumbnail: '',
        url: '',
      });
      setEditingVideo(null);
      setIsAddingVideo(false);
    } catch (error) {
      console.error('Error saving video:', error);
      showNotification('حدث خطأ أثناء حفظ الفيديو. يرجى المحاولة مرة أخرى.', 'error');
    }
  };

  return (
    <>
      <div
        className="fixed top-24 inset-x-0 flex flex-col items-center gap-3 px-4 z-50 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {notifications.map((notification) => {
          const isSuccess = notification.type === 'success';
          return (
            <div
              key={notification.id}
              className={`w-full max-w-md rounded-2xl border shadow-lg pointer-events-auto transition-transform origin-top ${
                isSuccess
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3 p-4">
                <div
                  className={`p-2 rounded-full ${
                    isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isSuccess ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                </div>
                <div className="flex-1 text-sm font-semibold text-secondary leading-relaxed">
                  {notification.message}
                </div>
                <button
                  type="button"
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="إغلاق التنبيه"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="min-h-screen bg-light pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-r-4 border-primary">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <Settings className="text-primary" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-secondary">لوحة التحكم</h1>
                <p className="text-gray-600 mt-1">إدارة محتوى الموقع</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Home size={18} />
                <span>رئيسية الموقع</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <LogOut size={18} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-right rounded-2xl p-5 bg-white border border-transparent shadow-md md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Users size={24} />
              </div>
              <span className="text-xs font-bold text-gray-400">إحصائيات الزيارات</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-xl border border-green-100 bg-gradient-to-l from-green-50 via-white to-transparent p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="text-base font-bold text-secondary">الحقيقيين</h3>
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>غير بوت</span>
                  </span>
                </div>
                <div className="text-3xl font-bold text-green-700 leading-none" dir="ltr">
                  {typeof humanVisitCount === 'number'
                    ? humanVisitCount.toLocaleString('ar')
                    : isVisitCountsLoading
                      ? '...'
                      : '--'}
                </div>
              </div>

              <div className="rounded-xl border border-amber-100 bg-gradient-to-l from-amber-50 via-white to-transparent p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="text-base font-bold text-secondary">البوتات</h3>
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Bot</span>
                  </span>
                </div>
                <div className="text-3xl font-bold text-amber-700 leading-none" dir="ltr">
                  {typeof botVisitCount === 'number'
                    ? botVisitCount.toLocaleString('ar')
                    : isVisitCountsLoading
                      ? '...'
                      : '--'}
                </div>
              </div>
            </div>
          </div>
          {dashboardCards.map((card) => {
            const CardIcon = card.icon;
            const isActive = activeTab === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardSelect(card.id)}
                className={`text-right rounded-2xl p-5 bg-white border transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-xl ${
                  isActive ? 'border-primary shadow-2xl ring-1 ring-primary/20' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <CardIcon size={24} />
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {isActive ? 'مفتوح' : 'اضغط للعرض'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
              </button>
            );
          })}
        </div>

        <div ref={contentRef} className="mt-10 space-y-10">
          {!activeTab && (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-600">
              <p className="text-lg font-bold text-secondary mb-2">أهلاً بك في لوحة التحكم</p>
              <p className="text-sm text-gray-500">اختر أحد المربعات أعلاه لعرض أدوات الإدارة المناسبة.</p>
            </div>
          )}

          {/* Sections Management */}
          {activeTab === 'sections' && (
          <div className="space-y-4">
            {sections.map((section) => {
              const isVisible = data.visibility[section.id as keyof typeof data.visibility];
              const sectionData = data[section.id as keyof typeof data];
              const Icon = section.icon;

              return (
                <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isVisible ? 'bg-primary-50' : 'bg-gray-100'
                        }`}>
                          <Icon className={isVisible ? 'text-primary' : 'text-gray-400'} size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-secondary">{section.name}</h3>
                          <p className={`text-sm ${isVisible ? 'text-green-600' : 'text-red-600'}`}>
                            {isVisible ? 'مفعل' : 'معطل'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        <button
                          onClick={() =>
                            handleToggleSectionVisibility(
                              section.id as keyof typeof data.visibility,
                              section.name,
                              isVisible
                            )}
                          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                            isVisible
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {isVisible ? (
                            <>
                              <EyeOff size={18} />
                              <span>تعطيل</span>
                            </>
                          ) : (
                            <>
                              <Eye size={18} />
                              <span>تفعيل</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit size={18} />
                          <span>تعديل</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {editingSection === section.id && (
                    <SectionEditor
                      sectionId={section.id}
                      sectionData={sectionData}
                      onSave={(formData) => handleSaveSection(section.id, formData, section.name)}
                      onCancel={() => setEditingSection(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>
          )}

          {/* Articles Management */}
          {activeTab === 'articles' && (
          <div className="space-y-6">
            {/* Add New Article Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setNewArticle({
                    title: '',
                    excerpt: '',
                    date: getTodayDate(),
                    category: 'أخبار',
                    image: '',
                  });
                }}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span>إضافة مقال جديد</span>
              </button>
            </div>

            {/* Article Form */}
            {(editingArticle !== null || Object.values(newArticle).some(v => v !== '')) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-secondary mb-6">
                  {editingArticle !== null ? 'تعديل المقال' : 'مقال جديد'}
                </h3>
                <ArticleForm
                  article={newArticle}
                  onChange={(updated) => {
                    setNewArticle(updated);
                  }}
                  onSave={handleSaveArticle}
                  onCancel={() => {
                    setEditingArticle(null);
                    setNewArticle({
                      title: '',
                      excerpt: '',
                      date: getTodayDate(),
                      category: 'أخبار',
                      image: '',
                    });
                  }}
                  notify={showNotification}
                />
              </div>
            )}

            {/* Articles List */}
            <div className="space-y-4">
              {articles.map((article, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/service.png';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-secondary mb-2">{article.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{article.date}</span>
                              <span className="px-2 py-1 bg-accent-50 text-accent rounded text-xs font-bold">
                                {article.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                          <button
                            onClick={() => {
                              setEditingArticle(index);
                              setNewArticle({ ...articles[index] });
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit size={18} />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
                                try {
                                  await deleteArticle(index);
                                  showNotification('تم حذف المقال بنجاح');
                                } catch (error) {
                                  console.error('Error deleting article:', error);
                                  showNotification('حدث خطأ أثناء حذف المقال.', 'error');
                                }
                              }
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 size={18} />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Videos Management */}
          {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Add New Video Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={() => {
                  setEditingVideo(null);
                  setIsAddingVideo(true);
                  setNewVideo({
                    title: '',
                    thumbnail: '',
                    url: '',
                  });
                }}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span>إضافة فيديو جديد</span>
              </button>
            </div>

            {/* Video Form */}
            {(isAddingVideo || editingVideo !== null || Object.values(newVideo).some(v => v !== '')) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-secondary mb-6">
                  {editingVideo !== null ? 'تعديل الفيديو' : 'فيديو جديد'}
                </h3>
                <VideoForm
                  video={newVideo}
                  onChange={(updated) => {
                    setNewVideo(updated);
                  }}
                  onSave={handleSaveVideo}
                  onCancel={() => {
                    setEditingVideo(null);
                    setIsAddingVideo(false);
                    setNewVideo({
                      title: '',
                      thumbnail: '',
                      url: '',
                    });
                  }}
                  notify={showNotification}
                />
              </div>
            )}

            {/* Videos List */}
            <div className="space-y-4">
              {videos.map((video, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/service.png';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-secondary mb-2">{video.title}</h3>
                            <a 
                              href={video.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary text-sm hover:underline break-all"
                            >
                              {video.url}
                            </a>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                          <button
                            onClick={() => {
                              setEditingVideo(index);
                              setIsAddingVideo(false);
                              setNewVideo({ ...videos[index] });
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit size={18} />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
                                try {
                                  await deleteVideo(index);
                                  showNotification('تم حذف الفيديو بنجاح');
                                } catch (error) {
                                  console.error('Error deleting video:', error);
                                  showNotification('حدث خطأ أثناء حذف الفيديو.', 'error');
                                }
                              }
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 size={18} />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Clients Management */}
          {activeTab === 'clients' && (
          <div className="space-y-6">
            {/* Add New Client Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={() => {
                  setEditingClient(null);
                  setIsAddingClient(true);
                  setNewClient({
                    name: '',
                    logo: '',
                  });
                }}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span>إضافة عميل جديد</span>
              </button>
            </div>

            {/* Client Form */}
            {(isAddingClient || editingClient !== null || Object.values(newClient).some(v => v !== '')) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-secondary mb-6">
                  {editingClient !== null ? 'تعديل العميل' : 'عميل جديد'}
                </h3>
                <ClientForm
                  client={newClient}
                  onChange={(updated) => {
                    setNewClient(updated);
                  }}
                  onSave={handleSaveClient}
                  onCancel={() => {
                    setEditingClient(null);
                    setIsAddingClient(false);
                    setNewClient({
                      name: '',
                      logo: '',
                    });
                  }}
                  notify={showNotification}
                />
              </div>
            )}

            {/* Clients List */}
            <div className="space-y-4">
              {clients.map((client, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="w-24 h-24 object-contain rounded-lg flex-shrink-0 border border-gray-200 bg-white p-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/service.png';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-secondary mb-1">{client.name}</h3>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                          <button
                            onClick={() => {
                              setEditingClient(index);
                              setIsAddingClient(false);
                              setNewClient({ ...clients[index] });
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit size={18} />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
                                try {
                                  await deleteClient(index);
                                  showNotification('تم حذف العميل بنجاح');
                                } catch (error) {
                                  console.error('Error deleting client:', error);
                                  showNotification('حدث خطأ أثناء حذف العميل.', 'error');
                                }
                              }
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 size={18} />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Testimonials Management */}
          {activeTab === 'testimonials' && (
          <div className="space-y-6">
            {/* Add New Testimonial Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={() => {
                  setEditingTestimonial(null);
                  setNewTestimonial({
                    name: '',
                    role: '',
                    content: '',
                    image: '',
                    date: getTodayDate(),
                  });
                }}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span>إضافة رأي عميل جديد</span>
              </button>
            </div>

            {/* Testimonial Form */}
            {(editingTestimonial !== null || Object.values(newTestimonial).some(v => v !== '')) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-secondary mb-6">
                  {editingTestimonial !== null ? 'تعديل رأي العميل' : 'رأي عميل جديد'}
                </h3>
                <TestimonialForm
                  testimonial={newTestimonial}
                  onChange={(updated) => {
                    setNewTestimonial(updated);
                  }}
                  onSave={handleSaveTestimonial}
                  onCancel={() => {
                    setEditingTestimonial(null);
                    setNewTestimonial({
                      name: '',
                      role: '',
                      content: '',
                      image: '',
                      date: getTodayDate(),
                    });
                  }}
                  notify={showNotification}
                />
              </div>
            )}

            {/* Testimonials List */}
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-24 h-24 object-cover rounded-full flex-shrink-0 border-4 border-accent-50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/service.png';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-secondary mb-1">{testimonial.name}</h3>
                            <p className="text-accent text-sm font-bold mb-3">{testimonial.role}</p>
                            <p className="text-gray-600 text-sm mb-2 italic">"{testimonial.content}"</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{testimonial.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                          <button
                            onClick={() => {
                              setEditingTestimonial(index);
                              setNewTestimonial({ ...testimonials[index] });
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit size={18} />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm('هل أنت متأكد من حذف هذا الرأي؟')) {
                                try {
                                  await deleteTestimonial(index);
                                  showNotification('تم حذف رأي العميل بنجاح');
                                } catch (error) {
                                  console.error('Error deleting testimonial:', error);
                                  showNotification('حدث خطأ أثناء حذف رأي العميل.', 'error');
                                }
                              }
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 size={18} />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Password Change Management */}
          {activeTab === 'password' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <Lock className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary">تغيير كلمة المرور</h3>
                  <p className="text-gray-600 text-sm mt-1">قم بتحديث كلمة المرور لحسابك</p>
                </div>
              </div>

              {passwordError && (
                <div className="mb-6 bg-red-50 border-r-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-6 bg-green-50 border-r-4 border-green-500 p-4 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">تم تغيير كلمة المرور بنجاح!</p>
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPasswordError('');
                  setPasswordSuccess(false);

                  // التحقق من أن كلمة المرور الجديدة تتطابق مع التأكيد
                  if (passwordData.newPassword !== passwordData.confirmPassword) {
                    setPasswordError('كلمة المرور الجديدة وتأكيدها غير متطابقين');
                    return;
                  }

                  // التحقق من طول كلمة المرور
                  if (passwordData.newPassword.length < 6) {
                    setPasswordError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                    return;
                  }

                  setIsChangingPassword(true);
                  try {
                    const result = await changePassword(
                      passwordData.currentPassword,
                      passwordData.newPassword
                    );

                    if (result.success) {
                      setPasswordSuccess(true);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      // تسجيل الخروج التلقائي بعد تغيير كلمة المرور
                      setTimeout(() => {
                        logout();
                        navigate('/login');
                      }, 2000); // انتظار 2 ثانية لإظهار رسالة النجاح
                    } else {
                      setPasswordError(result.error || 'فشل تغيير كلمة المرور');
                    }
                  } catch (error) {
                    console.error('Error changing password:', error);
                    setPasswordError('حدث خطأ أثناء تغيير كلمة المرور');
                  } finally {
                    setIsChangingPassword(false);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-secondary mb-2">
                    كلمة المرور الحالية
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full bg-white border border-gray-200 p-3 text-base text-secondary focus:outline-none focus:border-primary transition-colors rounded"
                    placeholder="أدخل كلمة المرور الحالية"
                    required
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-secondary mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full bg-white border border-gray-200 p-3 text-base text-secondary focus:outline-none focus:border-primary transition-colors rounded"
                    placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)"
                    required
                    minLength={6}
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-500 mt-1">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-secondary mb-2">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full bg-white border border-gray-200 p-3 text-base text-secondary focus:outline-none focus:border-primary transition-colors rounded"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    required
                    minLength={6}
                    dir="ltr"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري التحديث...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>تغيير كلمة المرور</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setPasswordError('');
                      setPasswordSuccess(false);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    <span>إلغاء</span>
                  </button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border-r-4 border-blue-500 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>ملاحظة:</strong> بعد تغيير كلمة المرور، سيتم تسجيل خروجك تلقائياً من جميع الجلسات الأخرى. 
                  ستحتاج إلى تسجيل الدخول مرة أخرى باستخدام كلمة المرور الجديدة.
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

// Section Editor Component
const SectionEditor: React.FC<{
  sectionId: string;
  sectionData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}> = ({ sectionId, sectionData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(sectionData);

  // ضمان توفر عناصر قسم "المميزات" حتى يمكن تعديلها في لوحة التحكم
  // (في Supabase يتم إسقاط icon لأنه غير قابل للتسلسل، وقد لا تُحفظ items أصلاً في بعض الحالات)
  useEffect(() => {
    if (sectionId !== 'features') return;

    setFormData((prev: any) => {
      const hasItems = Array.isArray(prev?.items) && prev.items.length > 0;
      if (hasItems) return prev;
      return { ...prev, items: FEATURES };
    });
  }, [sectionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData((prev: any) => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const updateArrayItem = (arrayName: string, index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev };
      updated[arrayName] = [...updated[arrayName]];
      updated[arrayName][index] = { ...updated[arrayName][index], [field]: value };
      return updated;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-50 border-t border-gray-200">
      <div className="space-y-6">
        {sectionId === 'hero' && (
          <>
            <InputField label="الشارة" value={formData.badge} onChange={(v) => updateField('badge', v)} />
            <InputField label="العنوان" value={formData.title} onChange={(v) => updateField('title', v)} />
            <InputField label="العنوان المميز" value={formData.titleHighlight} onChange={(v) => updateField('titleHighlight', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
            <InputField label="نص الزر الأول" value={formData.button1Text} onChange={(v) => updateField('button1Text', v)} />
            <InputField label="نص الزر الثاني" value={formData.button2Text} onChange={(v) => updateField('button2Text', v)} />
            <InputField label="رابط الصورة" value={formData.image} onChange={(v) => updateField('image', v)} />
            <InputField label="اسم المحامي" value={formData.lawyerName} onChange={(v) => updateField('lawyerName', v)} />
            <InputField label="المنصب الأول" value={formData.lawyerTitle1} onChange={(v) => updateField('lawyerTitle1', v)} />
            <InputField label="المنصب الثاني" value={formData.lawyerTitle2} onChange={(v) => updateField('lawyerTitle2', v)} />
          </>
        )}

        {sectionId === 'about' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
            <InputField label="رابط الصورة" value={formData.image} onChange={(v) => updateField('image', v)} />
            {formData.features?.map((feature: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-secondary mb-3">الميزة {index + 1}</h4>
                <InputField label="العنوان" value={feature.title} onChange={(v) => updateArrayItem('features', index, 'title', v)} />
                <TextareaField label="الوصف" value={feature.description} onChange={(v) => updateArrayItem('features', index, 'description', v)} />
              </div>
            ))}
          </>
        )}

        {sectionId === 'services' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
            {formData.items?.map((item: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-secondary mb-3">الخدمة {index + 1}</h4>
                <InputField label="العنوان" value={item.title} onChange={(v) => updateArrayItem('items', index, 'title', v)} />
                <TextareaField label="الوصف" value={item.description} onChange={(v) => updateArrayItem('items', index, 'description', v)} />
                <InputField label="رابط الصورة" value={item.image} onChange={(v) => updateArrayItem('items', index, 'image', v)} />
              </div>
            ))}
          </>
        )}

        {sectionId === 'stats' && (
          <>
            <InputField label="عدد العملاء" value={formData.clients} onChange={(v) => updateField('clients', v)} />
            <InputField label="التعويضات" value={formData.compensation} onChange={(v) => updateField('compensation', v)} />
            <InputField label="سنوات الخبرة" value={formData.experience} onChange={(v) => updateField('experience', v)} />
            <InputField label="نسبة النجاح" value={formData.successRate} onChange={(v) => updateField('successRate', v)} />
            <InputField label="العنوان" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
            <InputField label="رابط الصورة" value={formData.image} onChange={(v) => updateField('image', v)} />
          </>
        )}

        {sectionId === 'cta' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
            <InputField label="رقم الهاتف" value={formData.phone} onChange={(v) => updateField('phone', v)} />
            <InputField label="نص الزر" value={formData.buttonText} onChange={(v) => updateField('buttonText', v)} />
          </>
        )}

        {sectionId === 'features' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
            {Array.isArray(formData.items) && formData.items.length > 0 && (
              <div className="space-y-4">
                {formData.items.map((item: any, index: number) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-secondary mb-3">الميزة {index + 1}</h4>
                    <InputField
                      label="العنوان"
                      value={item.title}
                      onChange={(v) => updateArrayItem('items', index, 'title', v)}
                    />
                    <TextareaField
                      label="الوصف"
                      value={item.description}
                      onChange={(v) => updateArrayItem('items', index, 'description', v)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {sectionId === 'testimonials' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
          </>
        )}

        {sectionId === 'clients' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
          </>
        )}

        {sectionId === 'videos' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
          </>
        )}

        {sectionId === 'videos' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
          </>
        )}

        {sectionId === 'news' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
          </>
        )}

        {sectionId === 'faq' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
            {formData.items?.map((item: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-secondary mb-3">سؤال {index + 1}</h4>
                <InputField label="السؤال" value={item.question} onChange={(v) => updateArrayItem('items', index, 'question', v)} />
                <TextareaField label="الجواب" value={item.answer} onChange={(v) => updateArrayItem('items', index, 'answer', v)} />
              </div>
            ))}
          </>
        )}

        {sectionId === 'contact' && (
          <>
            <InputField label="العنوان الفرعي" value={formData.subtitle} onChange={(v) => updateField('subtitle', v)} />
            <InputField label="العنوان الرئيسي" value={formData.title} onChange={(v) => updateField('title', v)} />
            <TextareaField label="الوصف" value={formData.description} onChange={(v) => updateField('description', v)} />
            <InputField label="العنوان" value={formData.address} onChange={(v) => updateField('address', v)} />
            <InputField label="رقم الهاتف" value={formData.phone} onChange={(v) => updateField('phone', v)} />
            <InputField label="البريد الإلكتروني" value={formData.email} onChange={(v) => updateField('email', v)} />
          </>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
          >
            <Save size={20} />
            <span>حفظ التغييرات</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            <span>إلغاء</span>
          </button>
        </div>
      </div>
    </form>
  );
};

// Article Form Component
const ArticleForm: React.FC<{
  article: Partial<Article>;
  onChange: (article: Partial<Article>) => void;
  onSave: () => void;
  onCancel: () => void;
  notify?: (message: string, type?: NotificationType) => void;
}> = ({ article, onChange, onSave, onCancel, notify }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="عنوان المقال"
        value={article.title || ''}
        onChange={(v) => onChange({ ...article, title: v })}
      />
      <TextareaField
        label="الملخص"
        value={article.excerpt || ''}
        onChange={(v) => onChange({ ...article, excerpt: v })}
      />
      <TextareaField
        label="المحتوى الكامل (اختياري)"
        value={article.content || ''}
        onChange={(v) => onChange({ ...article, content: v })}
        rows={10}
      />
      <InputField
        label="التاريخ"
        value={article.date || ''}
        onChange={(v) => onChange({ ...article, date: v })}
      />
      <InputField
        label="الفئة"
        value={article.category || ''}
        onChange={(v) => onChange({ ...article, category: v })}
      />
      <ImageUploadField
        label="صورة المقال"
        value={article.image || ''}
        onChange={(v) => onChange({ ...article, image: v })}
        notify={notify}
      />
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
        <button
          onClick={onSave}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          <span>حفظ</span>
        </button>
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <X size={20} />
          <span>إلغاء</span>
        </button>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-secondary mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 p-3 text-base text-secondary focus:outline-none focus:border-primary transition-colors rounded"
      />
    </div>
  );
};

// Reusable Textarea Component
const TextareaField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}> = ({ label, value, onChange, rows = 4 }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-secondary mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-white border border-gray-200 p-3 text-base text-secondary focus:outline-none focus:border-primary transition-colors rounded resize-none"
      />
    </div>
  );
};

// Image Upload Field Component
const ImageUploadField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  notify?: (message: string, type?: NotificationType) => void;
}> = ({ label, value, onChange, notify }) => {
  // تحديد نوع القيمة الحالية (base64 أو رابط)
  const isBase64 = value.startsWith('data:image');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>(isBase64 ? 'file' : 'url');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        notify?.('الرجاء اختيار ملف صورة صالح', 'error');
        return;
      }
      
      // التحقق من حجم الملف (حد أقصى 5MB)
      if (file.size > 5 * 1024 * 1024) {
        notify?.('حجم الملف كبير جداً. الحد الأقصى هو 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange(result);
        setUploadMethod('file');
      };
      reader.onerror = () => {
        notify?.('حدث خطأ أثناء قراءة الملف', 'error');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-secondary mb-2">{label}</label>
      
      {/* طريقة الرفع */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
            uploadMethod === 'url'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ImageIcon size={18} />
          <span>رابط</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setUploadMethod('file');
            fileInputRef.current?.click();
          }}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
            uploadMethod === 'file'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Upload size={18} />
          <span>رفع من الجهاز</span>
        </button>
      </div>

      {/* حقل الرابط */}
      {uploadMethod === 'url' && (
        <div className="space-y-2">
          <input
            type="text"
            value={isBase64 ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="أدخل رابط الصورة"
            className="w-full bg-white border border-gray-200 p-3 text-base text-secondary focus:outline-none focus:border-primary transition-colors rounded"
          />
          {isBase64 && (
            <p className="text-sm text-gray-500">الصورة الحالية مرفوعة من الجهاز. استخدم زر "رفع من الجهاز" لتغييرها.</p>
          )}
        </div>
      )}

      {/* حقل الرفع */}
      {uploadMethod === 'file' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 border-2 border-dashed border-gray-300"
          >
            <Upload size={20} />
            <span>{value && isBase64 ? 'تغيير الصورة' : 'اختر صورة من الجهاز'}</span>
          </button>
          {!isBase64 && value && (
            <p className="text-sm text-gray-500">الصورة الحالية من رابط. استخدم زر "رابط" لتعديلها.</p>
          )}
        </div>
      )}

      {/* معاينة الصورة */}
      {value && (
        <div className="mt-4 relative">
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="max-w-full h-auto max-h-48 rounded-lg border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="إزالة الصورة"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Testimonial Form Component
const TestimonialForm: React.FC<{
  testimonial: Partial<Testimonial>;
  onChange: (testimonial: Partial<Testimonial>) => void;
  onSave: () => void;
  onCancel: () => void;
  notify?: (message: string, type?: NotificationType) => void;
}> = ({ testimonial, onChange, onSave, onCancel, notify }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="اسم العميل"
        value={testimonial.name || ''}
        onChange={(v) => onChange({ ...testimonial, name: v })}
      />
      <InputField
        label="مصدر التقييم"
        value={testimonial.role || ''}
        onChange={(v) => onChange({ ...testimonial, role: v })}
      />
      <TextareaField
        label="محتوى الرأي"
        value={testimonial.content || ''}
        onChange={(v) => onChange({ ...testimonial, content: v })}
        rows={5}
      />
      <ImageUploadField
        label="صورة العميل"
        value={testimonial.image || ''}
        onChange={(v) => onChange({ ...testimonial, image: v })}
        notify={notify}
      />
      <InputField
        label="التاريخ"
        value={testimonial.date || ''}
        onChange={(v) => onChange({ ...testimonial, date: v })}
      />
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
        <button
          onClick={onSave}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          <span>حفظ</span>
        </button>
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <X size={20} />
          <span>إلغاء</span>
        </button>
      </div>
    </div>
  );
};

// Client Form Component
const ClientForm: React.FC<{
  client: Partial<Client>;
  onChange: (client: Partial<Client>) => void;
  onSave: () => void;
  onCancel: () => void;
  notify?: (message: string, type?: NotificationType) => void;
}> = ({ client, onChange, onSave, onCancel, notify }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="اسم الشركة"
        value={client.name || ''}
        onChange={(v) => onChange({ ...client, name: v })}
      />
      <ImageUploadField
        label="شعار الشركة"
        value={client.logo || ''}
        onChange={(v) => onChange({ ...client, logo: v })}
        notify={notify}
      />
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
        <button
          onClick={onSave}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          <span>حفظ</span>
        </button>
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <X size={20} />
          <span>إلغاء</span>
        </button>
      </div>
    </div>
  );
};

// Video Form Component
const VideoForm: React.FC<{
  video: Partial<VideoItem>;
  onChange: (video: Partial<VideoItem>) => void;
  onSave: () => void;
  onCancel: () => void;
  notify?: (message: string, type?: NotificationType) => void;
}> = ({ video, onChange, onSave, onCancel, notify }) => {
  const [isLoadingThumbnail, setIsLoadingThumbnail] = React.useState(false);

  // جلب الصورة المصغرة والمدة تلقائياً عند تغيير رابط الفيديو
  const handleUrlChange = async (url: string) => {
    onChange({ ...video, url });
    
    // إذا كان الرابط فارغاً، لا نفعل شيء
    if (!url || url.trim() === '') {
      return;
    }

    // التحقق من نوع المنصة
    const platform = detectVideoPlatform(url);
    
    // إذا لم يتم التعرف على المنصة، لا نحاول جلب المعلومات
    if (platform === 'unknown') {
      return;
    }

    // جلب الصورة المصغرة والمدة
    setIsLoadingThumbnail(true);
    try {
      const info = await getVideoInfo(url);
      const updatedVideo = { ...video, url, thumbnail: info.thumbnail };
      
      // إزالة المدة من الواجهة
      onChange(updatedVideo);
      notify?.('تم جلب الصورة المصغرة تلقائياً', 'success');
    } catch (error) {
      console.error('Error fetching video info:', error);
      notify?.('فشل جلب معلومات الفيديو تلقائياً. يمكنك إضافة المعلومات يدوياً.', 'error');
    } finally {
      setIsLoadingThumbnail(false);
    }
  };

  // تحديد placeholder حسب نوع المنصة المدعومة
  const getPlaceholder = () => {
    const platform = detectVideoPlatform(video.url || '');
    switch (platform) {
      case 'youtube':
        return 'https://www.youtube.com/watch?v=... أو https://youtu.be/...';
      case 'tiktok':
        return 'https://www.tiktok.com/@username/video/...';
      case 'snapchat':
        return 'https://www.snapchat.com/add/username';
      default:
        return 'https://www.youtube.com/watch?v=... أو https://www.tiktok.com/@username/video/... أو https://www.snapchat.com/add/username';
    }
  };

  return (
    <div className="space-y-4">
      <InputField
        label="عنوان الفيديو"
        value={video.title || ''}
        onChange={(v) => onChange({ ...video, title: v })}
      />
      <div>
        <label className="block text-sm font-bold text-secondary mb-2">
          رابط الفيديو (URL)
        </label>
        <div className="relative">
          <input
            type="text"
            value={video.url || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full bg-white border border-gray-200 p-3 text-base text-secondary focus:outline-none focus:border-primary transition-colors rounded"
          />
          {isLoadingThumbnail && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          المدعوم: يوتيوب، تيك توك، سناب شات - سيتم جلب الصورة المصغرة تلقائياً
        </p>
      </div>
      <ImageUploadField
        label="صورة مصغرة للفيديو"
        value={video.thumbnail || ''}
        onChange={(v) => onChange({ ...video, thumbnail: v })}
        notify={notify}
      />
      {video.thumbnail && video.thumbnail !== '/images/service.png' && (
        <div className="bg-green-50 border-r-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            ✓ تم جلب الصورة المصغرة تلقائياً من رابط الفيديو
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
        <button
          onClick={onSave}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          <span>حفظ</span>
        </button>
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <X size={20} />
          <span>إلغاء</span>
        </button>
      </div>
    </div>
  );
};

export default Admin;
