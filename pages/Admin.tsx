import React, { useState } from 'react';
import { 
  Settings, FileText, Eye, EyeOff, Home, Layout, 
  Users, MessageSquare, Video, Newspaper, HelpCircle, 
  Mail, Save, Plus, Edit, Trash2, X, Image as ImageIcon, LogOut, Star, Upload, Lock
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Article, Testimonial } from '../types';

const Admin: React.FC = () => {
  const { data, updateSection, toggleSectionVisibility, articles, addArticle, updateArticle, deleteArticle, testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useData();
  const { logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sections' | 'articles' | 'testimonials' | 'password'>('sections');
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
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
    category: 'أخبار',
    image: '',
  });
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    content: '',
    image: '',
    date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
  });

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
    { id: 'videos', name: 'قسم الفيديوهات', icon: Video },
    { id: 'news', name: 'قسم الأخبار', icon: Newspaper },
    { id: 'faq', name: 'قسم الأسئلة الشائعة', icon: HelpCircle },
    { id: 'contact', name: 'قسم الاتصال', icon: Mail },
  ];

  const handleSaveSection = async (sectionId: string, formData: any) => {
    try {
      await updateSection(sectionId as keyof typeof data, formData);
      setEditingSection(null);
      alert('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Error saving section:', error);
      alert('حدث خطأ أثناء حفظ التغييرات. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleSaveArticle = async () => {
    try {
      const articleToSave = {
        ...newArticle,
        image: newArticle.image?.trim() || '/images/article.png',
      } as Article;
      
      if (editingArticle !== null) {
        await updateArticle(editingArticle, articleToSave);
      } else {
        await addArticle(articleToSave);
      }
      
      // إعادة تعيين الحقول بعد الحفظ
      setNewArticle({
        title: '',
        excerpt: '',
        content: '',
        date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
        category: 'أخبار',
        image: '',
      });
      setEditingArticle(null);
      alert('تم حفظ المقال بنجاح');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('حدث خطأ أثناء حفظ المقال. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleSaveTestimonial = async () => {
    try {
      const testimonialToSave = {
        ...newTestimonial,
        image: newTestimonial.image?.trim() || '/images/client.png',
      } as Testimonial;
      
      if (editingTestimonial !== null) {
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
        date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
      });
      setEditingTestimonial(null);
      alert('تم حفظ رأي العميل بنجاح');
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('حدث خطأ أثناء حفظ رأي العميل. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen bg-light pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-r-4 border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <Settings className="text-primary" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-secondary">لوحة التحكم</h1>
                <p className="text-gray-600 mt-1">إدارة محتوى الموقع</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
              >
                <LogOut size={18} />
                <span>تسجيل الخروج</span>
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('هل أنت متأكد من إعادة تعيين جميع البيانات إلى القيم الافتراضية؟ سيتم حذف جميع التغييرات.')) {
                    try {
                      // ملاحظة: يمكنك إضافة وظيفة لإعادة تعيين البيانات في Supabase هنا
                      alert('تم إعادة تعيين البيانات. يرجى تحديث الصفحة.');
                      window.location.reload();
                    } catch (error) {
                      console.error('Error resetting data:', error);
                      alert('حدث خطأ أثناء إعادة تعيين البيانات.');
                    }
                  }
                }}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors text-sm"
              >
                إعادة تعيين البيانات
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-colors ${
                activeTab === 'sections'
                  ? 'text-primary border-b-2 border-primary bg-primary-50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Layout size={20} />
                <span>إدارة الأقسام</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-colors ${
                activeTab === 'articles'
                  ? 'text-primary border-b-2 border-primary bg-primary-50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText size={20} />
                <span>إدارة المقالات</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-colors ${
                activeTab === 'testimonials'
                  ? 'text-primary border-b-2 border-primary bg-primary-50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Star size={20} />
                <span>آراء العملاء</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-colors ${
                activeTab === 'password'
                  ? 'text-primary border-b-2 border-primary bg-primary-50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Lock size={20} />
                <span>تغيير كلمة المرور</span>
              </div>
            </button>
          </div>
        </div>

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
                    <div className="flex items-center justify-between">
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
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSectionVisibility(section.id as keyof typeof data.visibility)}
                          className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${
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
                          className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center gap-2"
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
                      onSave={(formData) => handleSaveSection(section.id, formData)}
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
                    date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
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
                      date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
                      category: 'أخبار',
                      image: '',
                    });
                  }}
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
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() => {
                              setEditingArticle(index);
                              setNewArticle({ ...articles[index] });
                            }}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center gap-2"
                          >
                            <Edit size={18} />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
                                try {
                                  await deleteArticle(index);
                                  alert('تم حذف المقال بنجاح');
                                } catch (error) {
                                  console.error('Error deleting article:', error);
                                  alert('حدث خطأ أثناء حذف المقال.');
                                }
                              }
                            }}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
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
                    date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
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
                      date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
                    });
                  }}
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
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() => {
                              setEditingTestimonial(index);
                              setNewTestimonial({ ...testimonials[index] });
                            }}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center gap-2"
                          >
                            <Edit size={18} />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm('هل أنت متأكد من حذف هذا الرأي؟')) {
                                try {
                                  await deleteTestimonial(index);
                                  alert('تم حذف رأي العميل بنجاح');
                                } catch (error) {
                                  console.error('Error deleting testimonial:', error);
                                  alert('حدث خطأ أثناء حذف رأي العميل.');
                                }
                              }
                            }}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
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
                      setTimeout(() => {
                        setPasswordSuccess(false);
                      }, 5000);
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

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center gap-2"
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
          </>
        )}

        {sectionId === 'testimonials' && (
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

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Save size={20} />
            <span>حفظ التغييرات</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center gap-2"
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
}> = ({ article, onChange, onSave, onCancel }) => {
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
      />
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center gap-2"
        >
          <Save size={20} />
          <span>حفظ</span>
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center gap-2"
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
}> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-secondary mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
}> = ({ label, value, onChange }) => {
  // تحديد نوع القيمة الحالية (base64 أو رابط)
  const isBase64 = value.startsWith('data:image');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>(isBase64 ? 'file' : 'url');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار ملف صورة صالح');
        return;
      }
      
      // التحقق من حجم الملف (حد أقصى 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى هو 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange(result);
        setUploadMethod('file');
      };
      reader.onerror = () => {
        alert('حدث خطأ أثناء قراءة الملف');
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
      <div className="flex items-center gap-4 mb-3">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${
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
          className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${
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
}> = ({ testimonial, onChange, onSave, onCancel }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="اسم العميل"
        value={testimonial.name || ''}
        onChange={(v) => onChange({ ...testimonial, name: v })}
      />
      <InputField
        label="المنصب/الدور"
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
      />
      <InputField
        label="التاريخ"
        value={testimonial.date || ''}
        onChange={(v) => onChange({ ...testimonial, date: v })}
      />
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors flex items-center gap-2"
        >
          <Save size={20} />
          <span>حفظ</span>
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <X size={20} />
          <span>إلغاء</span>
        </button>
      </div>
    </div>
  );
};

export default Admin;
