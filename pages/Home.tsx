import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Gavel, CheckCircle2, ChevronDown, MessageCircle, CheckCircle, Scale, PlayCircle, ArrowRight, Twitter, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import { SERVICES, FEATURES, TESTIMONIALS, FAQ_ITEMS, ARTICLES, FALLBACK_VIDEOS, TIKTOK_USERNAME } from '../data/constants';
import { VideoItem } from '../types';
import { fetchTikTokVideos } from '../utils/tiktok';

const Home: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [videos, setVideos] = useState<VideoItem[]>(FALLBACK_VIDEOS);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Fetch TikTok videos on component mount
  useEffect(() => {
    const loadTikTokVideos = async () => {
      setIsLoadingVideos(true);
      try {
        const fetchedVideos = await fetchTikTokVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Failed to load TikTok videos:', error);
        setVideos(FALLBACK_VIDEOS);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    loadTikTokVideos();
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative pt-20 flex items-center min-h-[90vh] bg-light overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="space-y-8 md:pl-10 order-2 md:order-1 fade-in-up py-10 md:py-0">
              <span className="text-primary font-bold tracking-widest text-base uppercase">شركة محاماة رائدة</span>
              <h1 className="text-5xl md:text-7xl font-bold text-secondary leading-tight">
                استخدم خبرتنا <br />
                <span className="text-primary">القانونية الفعالة</span>
              </h1>
              <p className="text-gray-600 text-xl leading-relaxed max-w-lg font-medium">
                ندافع عن حقوقك ونساعدك على النجاح. فريقنا المتخصص يضمن لك أفضل تمثيل قانوني في كافة القضايا التجارية والشخصية.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="https://wa.me/966509579993" target="_blank" rel="noopener noreferrer">
                  <Button className="text-lg px-10 py-4">اطلب استشارة</Button>
                </a>
                <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('#about'); }}>
                  <Button variant="outline" className="text-lg px-10 py-4">تعرف علينا</Button>
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative order-1 md:order-2 h-full min-h-[400px] md:min-h-[600px]">
              <div className="absolute inset-0 bg-primary-100 rounded-bl-[100px] -z-10 transform translate-x-6 translate-y-6"></div>
              <img 
                src="/images/lawyer.png" 
                alt="Saudi Business Man" 
                className="w-full h-full object-cover rounded-bl-[100px] shadow-2xl"
              />
              <div className="absolute bottom-8 right-8 bg-white p-6 lg:p-8 shadow-2xl max-w-sm hidden lg:block border-r-4 border-primary rounded-lg backdrop-blur-sm">
                <div className="text-right space-y-3">
                  <span className="inline-block uppercase tracking-wider text-xs font-bold text-primary mb-2">
                    المحامي
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-secondary leading-tight">
                    مسفر محمد العرجاني
                  </h3>
                  <div className="h-1 w-16 bg-primary ml-auto mr-0"></div>
                  <p className="text-sm text-gray-600 leading-relaxed pt-2">
                    عضو اساسي في هيئة المحامين
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    مسجل عيني للعقار
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider: Hero → About */}
      <section className="py-12 bg-gradient-to-b from-light to-white relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 via-primary/20 to-transparent"></div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white w-full">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative pb-20 sm:pb-24 md:pb-0">
              <div className="border-[12px] border-light relative z-10">
                <img 
                  src="/images/lawyer2.png" 
                  alt="Business Meeting" 
                  className="w-full h-auto shadow-lg"
                />
              </div>
              <div className="absolute bottom-0 left-0 md:-bottom-8 md:-left-8 w-36 h-36 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-accent p-3 sm:p-4 md:p-8 flex flex-col justify-center items-center text-white z-20 shadow-xl">
                <span className="text-3xl sm:text-4xl md:text-6xl font-bold">تميزنا</span>
                <span className="text-center text-[10px] sm:text-xs md:text-base font-bold uppercase tracking-wide mt-1 md:mt-2 leading-tight sm:leading-normal">بسرعة الخدمة وجودة العمل</span>
              </div>
            </div>

            <div>
              <SectionHeading 
                subtitle="عن شركة مسفر محمد العرجاني"
                title="خبرة قانونية راسخة عبر سنوات من الممارسة"
                description="مكتبنا للمحاماة محترف ومكرس لمساعدة العملاء على حل المشكلات وتحقيق الأهداف. نقدم مجموعة كاملة من الخدمات للتعامل مع القضايا القانونية من أي تعقيد للأفراد والشركات والمنظمات الكبيرة."
                align="left"
              />
              
              <div className="space-y-8 mt-10">
                <div className="flex gap-5 bg-gradient-to-l from-accent/5 via-accent/3 to-transparent rounded-lg p-5 md:p-6 border-r-4 border-accent">
                  <div className="w-14 h-14 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 text-accent">
                    <Scale size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-secondary mb-3">رفع القضايا وكتابة المذكرات القانونية وحضور الجلسات</h3>
                    <p className="text-gray-700 text-lg font-medium">نقدم خدمات رفع القضايا وكتابة المذكرات القانونية وحضور الجلسات للأفراد والشركات والمنظمات الكبيرة.</p>
                  </div>
                </div>
                <div className="flex gap-5 bg-gradient-to-l from-accent/5 via-accent/3 to-transparent rounded-lg p-5 md:p-6 border-r-4 border-accent">
                  <div className="w-14 h-14 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 text-accent">
                    <Users size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-secondary mb-3">استشارات قانونية ودراسة المستندات والعقود</h3>
                    <p className="text-gray-700 text-lg font-medium">نقدم خدمات استشارات قانونية ودراسة المستندات والعقود للأفراد والشركات والمنظمات الكبيرة.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}>
                  <Button variant="outline" className="text-lg px-10 py-4">تواصل معنا</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider: About → Services */}
      <section className="py-12 bg-gradient-to-b from-white to-light relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 via-primary/20 to-transparent"></div>
      </section>

      {/* Services Preview Section */}
      <section id="services" className="py-24 bg-light w-full">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            subtitle="كيف يمكننا مساعدتك"
            title="منظومة خدماتنا القانونية"
            description="مهما كانت قضيتك، يمكننا مساعدتك فيها بفضل خبرتنا الواسعة."
          />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mt-16">
            {SERVICES.slice(0, 3).map((service, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-l from-primary/5 via-primary/3 to-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden border-r-4 border-primary rounded-lg transform hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="h-64 lg:h-72 overflow-hidden relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-secondary/10 to-transparent group-hover:from-secondary/20 transition-all duration-500 z-10"></div>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xs font-bold uppercase tracking-wider">خدمة {index + 1}</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex-grow flex flex-col">
                  <h3 className="text-xl lg:text-2xl font-bold text-secondary mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base font-medium flex-grow">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}>
              <Button className="text-lg px-12 py-4">احصل على استشارة</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Divider: Services → Stats */}
      <section className="py-0 bg-secondary relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 via-primary/30 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary text-white relative w-full">
        <div className="absolute inset-0 opacity-10 pointer-events-none w-full">
          <img src="/images/service.png" alt="background" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 md:order-1">
              <span className="text-accent font-bold tracking-widest text-sm uppercase mb-3 block">حقائق بالأرقام</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                نقدم حلولاً فعالة <br />
                آمنة ومستدامة.
              </h2>
              <p className="text-gray-300 text-xl mb-10 leading-relaxed">
                القانون في صفك، ثق بنا! سيقوم فريق المحامين ذوي الخبرة لدينا بإثبات ذلك ومساعدتك على النجاح في قضيتك.
              </p>
              
              <div className="grid grid-cols-2 gap-8 lg:gap-10">
                <div className="flex items-start gap-4">
                  <Users className="text-accent mt-1" size={36} />
                  <div>
                    <span className="block text-4xl font-bold text-white mb-1">978</span>
                    <span className="text-base text-gray-400">عميل سعيد</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Briefcase className="text-accent mt-1" size={36} />
                  <div>
                    <span className="block text-4xl font-bold text-white mb-1">66 M</span>
                    <span className="text-base text-gray-400">ريال تعويضات</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Gavel className="text-accent mt-1" size={36} />
                  <div>
                    <span className="block text-4xl font-bold text-white mb-1">25</span>
                    <span className="text-base text-gray-400">سنة خبرة</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-accent mt-1" size={36} />
                  <div>
                    <span className="block text-4xl font-bold text-white mb-1">99%</span>
                    <span className="text-base text-gray-400">قضايا ناجحة</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block h-full relative min-h-[600px] lg:min-h-[700px] order-1 md:order-2 overflow-hidden">
              <div className="absolute inset-0 -m-2 md:-m-4 lg:-m-6">
                <img 
                  src="/images/lawyer3.png" 
                  alt="Kingdom Centre Saudi Arabia" 
                  className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-white/5" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider: Stats → CTA */}
      <section className="py-0 bg-white relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gray-200"></div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 bg-white w-full">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary text-sm font-bold tracking-widest uppercase mb-3 block">استشارة</span>
          <h2 className="text-4xl font-serif font-bold text-secondary mb-6">احصل على استشارة مجانية!</h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-xl leading-relaxed">
            سندرس حالتك <span className="underline decoration-primary decoration-4 underline-offset-4">مجاناً</span> ونساعدك على النجاح. اتصل بنا اليوم لتبدأ الخطوة الأولى.
          </p>
          <div className="text-3xl font-bold text-secondary mb-10" dir="ltr">+966509579993</div>
          <a href="https://wa.me/966509579993" target="_blank" rel="noopener noreferrer">
            <Button className="text-lg px-12 py-4">أرسل طلباً</Button>
          </a>
        </div>
      </section>

      {/* Divider: CTA → Features */}
      <section className="py-0 bg-gradient-to-b from-white to-light relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 via-primary/20 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-light w-full">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            subtitle="لماذا تختارنا"
            title="أهم المميزات"
            description="إليك بضعة أسباب فقط للعمل مع شركة مسفر محمد العرجاني للمحاماة والاستشارات."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
            {FEATURES.map((feature, index) => (
              <div key={index} className="p-10 hover:shadow-xl transition-all duration-300 border border-gray-100 group rounded-sm bg-gradient-to-l from-primary/5 via-white via-primary/3 to-transparent border-r-4 border-primary">
                <div className="mb-8">
                  <feature.icon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <div className="h-0.5 w-16 bg-primary/30 mb-6 group-hover:w-24 transition-all"></div>
                <p className="text-gray-700 text-base leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider Section */}
      <section className="py-20 bg-gradient-to-b from-light via-white to-white relative w-full">
        {/* Decorative border separating sections */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 via-primary/30 to-transparent"></div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white w-full">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            subtitle="آراء العملاء"
            title="ماذا يقول عملاؤنا"
            description="نعتز بثقة عملائنا ونسعى دائماً لتحقيق أفضل النتائج لهم."
          />
          
          <div className="grid md:grid-cols-3 gap-10 mt-16">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="border border-gray-100 p-10 shadow-sm hover:shadow-xl transition-all text-center rounded-sm bg-gradient-to-l from-accent/5 via-white via-accent/3 to-transparent border-r-4 border-accent">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-8 border-4 border-accent-50">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-1">{testimonial.name}</h3>
                <p className="text-accent text-xs uppercase font-bold mb-6">{testimonial.role}</p>
                <p className="text-gray-700 italic leading-relaxed text-lg font-medium mb-6">"{testimonial.content}"</p>
                <span className="text-sm text-gray-400 block font-medium">{testimonial.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider: Testimonials → Videos */}
      <section className="py-12 bg-gradient-to-b from-white to-light relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 via-primary/20 to-transparent"></div>
      </section>

      {/* Visual Library Section */}
      <section id="videos" className="py-24 relative w-full">
        {/* Main Background Gradient - Right to Left across full section - Gold */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary/12 via-primary/6 via-white via-primary/6 to-primary/12 w-full"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <SectionHeading 
            subtitle="المكتبة المرئية"
            title="فيديوهات توعوية وقانونية"
            description="تابع أحدث الشروحات القانونية والأخبار عبر قنواتنا على وسائل التواصل الاجتماعي."
          />
          
          {isLoadingVideos ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">جاري تحميل الفيديوهات...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-10 mt-16">
              {videos.map((video, index) => (
                <a
                  key={index}
                  href={video.url || `https://www.tiktok.com/@${TIKTOK_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-light rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100 block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <span>🎵</span>
                      <span>TikTok</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-secondary mb-3 leading-snug group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                      <span className="flex items-center gap-1"><Users size={14} /> {video.views}</span>
                      <span className="text-primary font-bold flex items-center gap-1">
                        شاهد الآن
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12 flex justify-center gap-4 flex-wrap">
             <a 
               href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors"
             >
                <span className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="text-lg">🎵</span>
                </span>
                <span>تابعنا على تيك توك</span>
             </a>
             <a href="https://x.com/msfr_82" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors">
                <span className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-primary transition-colors"><Twitter size={20} /></span>
                <span>تابعنا على X</span>
             </a>
             <a href="https://www.youtube.com/@mesfer0000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors">
                <span className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-primary transition-colors"><Youtube size={20} /></span>
                <span>تابعنا على يوتيوب</span>
             </a>
          </div>
          
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-24 bg-light w-full">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            subtitle="الأخبار"
            title="اقرأ مقالاتنا"
            description="في مدونتنا، نناقش أحدث القضايا والتحليلات القانونية في المملكة."
          />
          
          <div className="grid md:grid-cols-3 gap-10 mt-16">
            {ARTICLES.map((article, index) => (
              <div key={index} className="group cursor-pointer bg-gradient-to-l from-accent/5 via-accent/3 to-transparent rounded-lg p-5 md:p-6 border-r-4 border-accent">
                <div className="h-64 overflow-hidden mb-8 relative rounded-sm">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-5 left-5 bg-accent text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-400 mb-4 space-x-3 space-x-reverse font-medium">
                   <span>{article.date}</span>
                   <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                   <span>أخبار</span>
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4 group-hover:text-accent transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed line-clamp-3 font-medium mb-6">
                  {article.excerpt}
                </p>
                <a href="#news" onClick={(e) => { e.preventDefault(); handleNavClick('#news'); }}>
                  <button className="text-base font-bold text-secondary uppercase border-b-2 border-accent/30 hover:border-accent pb-1 transition-all">
                    اقرأ المزيد
                  </button>
                </a>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* Divider: News → FAQ */}
      <section className="py-12 bg-gradient-to-b from-light to-white relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 via-primary/20 to-transparent"></div>
      </section>

      {/* FAQ & Image Split */}
      <section className="bg-white w-full">
        <div className="grid md:grid-cols-2">
          <div className="p-12 md:p-24">
            <span className="text-primary text-sm font-bold tracking-widest uppercase mb-3 block">الأسئلة الشائعة</span>
            <h2 className="text-4xl font-serif font-bold text-secondary mb-10">هل لا يزال لديك أي أسئلة؟</h2>
            <p className="text-gray-600 mb-10 text-lg">فيما يلي الإجابات على الأسئلة الأكثر شيوعاً التي تردنا من العملاء:</p>
            
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <div 
                  key={index} 
                  className={`bg-white border-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                    openFaqIndex === index 
                      ? 'border-primary shadow-xl' 
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <button 
                    className="w-full text-right p-6 md:p-7 flex justify-between items-center gap-4 hover:bg-primary-50/30 transition-all duration-300"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className={`font-bold text-lg text-secondary flex-1 text-right leading-relaxed ${
                      openFaqIndex === index ? 'text-primary' : ''
                    }`}>
                      {item.question}
                    </span>
                    <ChevronDown className={`flex-shrink-0 transform transition-transform duration-300 ${
                      openFaqIndex === index 
                        ? 'rotate-180 text-primary' 
                        : 'text-gray-400 group-hover:text-primary'
                    }`} size={22} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaqIndex === index 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 md:px-7 pb-6 md:pb-7 pt-0">
                      <div className="border-t-2 border-primary/20 pt-6">
                        <div className="flex items-start gap-4 bg-gradient-to-l from-primary/5 via-primary/3 to-transparent rounded-lg p-5 md:p-6 border-r-4 border-primary">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
                              <CheckCircle className="text-primary" size={20} strokeWidth={2.5} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 text-base md:text-lg leading-relaxed font-medium pr-2 text-right">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-[600px] md:h-auto">
            <img 
              src="/images/service.png" 
              alt="Architecture" 
              className="absolute inset-0 w-full h-full object-cover grayscale-[20%]"
            />
          </div>
        </div>
      </section>

      {/* Divider: FAQ → Contact */}
      <section className="py-12 bg-white relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white w-full">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            subtitle="اتصل بنا"
            title="نحن هنا لمساعدتك"
            description="تواصل معنا اليوم واحصل على استشارة قانونية مجانية"
          />
          
          <div className="grid md:grid-cols-2 gap-16 mt-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-light p-8 rounded-lg border-r-4 border-primary">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-2">المكتب الرئيسي</h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      طريق الملك فهد، الرياض، المملكة العربية السعودية
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-light p-8 rounded-lg border-r-4 border-primary">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-2">الهاتف</h3>
                    <a href="tel:+966509579993" className="text-gray-700 text-base hover:text-primary transition-colors" dir="ltr">
                      +966509579993
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-light p-8 rounded-lg border-r-4 border-primary">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-2">البريد الإلكتروني</h3>
                    <a href="mailto:info@al-arjani-law.com" className="text-gray-700 text-base hover:text-primary transition-colors">
                      info@al-arjani-law.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-light p-8 rounded-lg border-r-4 border-primary">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-primary" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-4">تواصل معنا عبر</h3>
                    <div className="flex gap-4">
                      <a href="https://wa.me/966509579993" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded hover:bg-secondary transition-colors">
                        <span className="text-xl">💬</span>
                      </a>
                      <a href="https://x.com/msfr_82" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded hover:bg-secondary transition-colors">
                        <Twitter size={24} />
                      </a>
                      <a href="https://www.youtube.com/@mesfer0000" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded hover:bg-secondary transition-colors">
                        <Youtube size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-light p-8 md:p-10 rounded-lg">
              <h3 className="text-2xl font-bold text-secondary mb-6">أرسل لنا رسالة</h3>
              <form className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="الاسم الكامل" 
                    className="w-full bg-white border border-gray-200 p-4 text-base text-secondary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors rounded"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="البريد الإلكتروني" 
                    className="w-full bg-white border border-gray-200 p-4 text-base text-secondary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors rounded"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="رقم الهاتف" 
                    className="w-full bg-white border border-gray-200 p-4 text-base text-secondary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors rounded"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="رسالتك" 
                    rows={6}
                    className="w-full bg-white border border-gray-200 p-4 text-base text-secondary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors rounded resize-none"
                  ></textarea>
                </div>
                <a href="https://wa.me/966509579993" target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full py-4 flex items-center justify-center gap-2">
                    <Send size={20} />
                    <span>أرسل الرسالة</span>
                  </Button>
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

