import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Gavel, ChevronDown, MessageCircle, CheckCircle, Scale, PlayCircle, ArrowRight, Twitter, Youtube, Mail, Phone, MapPin, FileText, HardHat } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import { FEATURES, SERVICE_ICONS } from '../data/constants';
import { useData } from '../contexts/DataContext';

const Home: React.FC = () => {
  const contextData = useData();
  const data = contextData?.data;
  const articles = contextData?.articles || [];
  const videos = contextData?.videos || [];
  const clients = contextData?.clients || [];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  // Ensure data has required structure
  if (!data.hero || !data.about || !data.services) {
    console.warn('Data structure incomplete, some sections may not render correctly');
  }
  
  // Ensure visibility object exists, use default if missing
  const defaultVisibility = {
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
    clients: true,
  };
  
  const visibility = (data.visibility && typeof data.visibility === 'object') 
    ? { ...defaultVisibility, ...data.visibility }
    : defaultVisibility;
  
  // Create a safe data object - ensure visibility is set correctly
  const safeData = {
    ...data,
    visibility,
  };

  const whatsappDigits =
    (safeData?.contact?.phone || safeData?.cta?.phone || '').replace(/[^0-9]/g, '') || '966553553042';
  const whatsappHref = `https://wa.me/${whatsappDigits}`;
  const mapsAppHref = 'https://www.google.com/maps/place/%E2%9A%96%EF%B8%8F%D8%B4%D8%B1%D9%83%D8%A9+%D9%85%D8%B3%D9%81%D8%B1%D9%85%D8%AD%D9%85%D8%AF%D8%A7%D9%84%D8%B9%D8%B1%D8%AC%D8%A7%D9%86%D9%8A+%D9%84%D9%84%D9%85%D8%AD%D8%A7%D9%85%D8%A7%D8%A9+%D9%88%D8%A7%D9%84%D8%AA%D9%88%D8%AB%D9%8A%D9%82%E2%80%AD/@24.6496688,46.783465,17z/data=!3m1!4b1!4m6!3m5!1s0x3e2f03007f940ec5:0x174cd12cb5396b82!8m2!3d24.6496639!4d46.7808901!16s%2Fg%2F11x6yngzn9?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D';
  // رابط embed من Google Maps - استخدام الإحداثيات مباشرة بدون API key
  // الإحداثيات من رابط الموقع: 24.6496639, 46.7808901
  const mapEmbedSrc = `https://maps.google.com/maps?q=24.6496639,46.7808901&hl=ar&z=16&output=embed`;
  
  // Check if at least one section is visible
  const hasVisibleSection = Object.values(visibility).some(visible => visible === true);
  const featureItems = Array.isArray(safeData.features?.items) && safeData.features.items.length > 0
    ? safeData.features.items
    : FEATURES;

  const heroDescriptionParts = (safeData.hero?.description || '')
    .split(/(?<=[.،])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const heroDescLine1 = heroDescriptionParts[0] || safeData.hero?.description || '';
  const heroDescLine2 = heroDescriptionParts.slice(1).join(' ');

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

  // Final safety check before rendering
  if (!safeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light pt-24">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">خطأ في تحميل البيانات</h2>
          <p className="text-gray-600 mb-6">لم يتم تحميل البيانات بشكل صحيح. يرجى إعادة تحميل الصفحة.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    );
  }

  // If no sections are visible, show message
  if (!hasVisibleSection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light pt-24">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">جميع الأقسام معطّلة</h2>
          <p className="text-gray-600 mb-6">يرجى تفعيل قسم واحد على الأقل في ملف <code className="text-sm bg-gray-100 px-2 py-1 rounded">data/site.ts</code> لعرض المحتوى.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      {visibility.hero === true && (
        <section id="home" className="relative flex items-center min-h-[90vh] overflow-hidden pt-20">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img src="/images/service.png" alt="" className="w-full h-full object-cover opacity-20" aria-hidden="true" />
          </div>
          <div className="absolute inset-0 z-[1]">
            <img
              src={safeData.hero.image}
              alt=""
              className="w-full h-full object-cover opacity-60"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-secondary/60 bg-gradient-to-l from-secondary/75 via-secondary/50 to-secondary/40" />
          </div>

          <div className="relative z-10 flex w-full justify-center px-6 sm:px-10 py-16 md:py-24 min-h-[calc(90vh-5rem)] items-center">
            <div className="max-w-[1536px] w-full">
              <div
                className="transition-all duration-700 ease-out transform opacity-100 translate-y-0"
                style={{ transitionDelay: '0ms' }}
              >
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tighter break-words hyphens-auto text-balance">
                  <span className="block">{safeData.hero.badge}</span>
                  <span className="block">
                    {safeData.hero.title}{' '}
                    <span className="text-primary">{safeData.hero.titleHighlight}</span>
                  </span>
                </h1>
              </div>

              <div
                className="transition-all duration-700 ease-out transform opacity-100 translate-y-0"
                style={{ transitionDelay: '200ms' }}
              >
                <p className="whitespace-pre-line text-gray-200 text-xl md:text-2xl font-normal leading-relaxed mt-4 break-words hyphens-auto max-w-4xl">
                  <span className="block">{heroDescLine1}</span>
                  {heroDescLine2 ? <span className="block">{heroDescLine2}</span> : null}
                </p>
              </div>

              <div
                className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto transition-all duration-700 ease-out transform opacity-100 translate-y-0"
                style={{ transitionDelay: '400ms' }}
              >
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-8 text-lg md:text-xl font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-600"
                >
                  <span>{safeData.hero.button1Text} ←</span>
                </a>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#about');
                  }}
                  className="h-12 px-8 text-lg md:text-xl font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white/20"
                >
                  <span>{safeData.hero.button2Text}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Divider: Hero → About */}
      <section className="py-6 bg-gradient-to-b from-light to-white relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 via-primary/20 to-transparent"></div>
      </section>

      {/* About Section */}
      {visibility.about === true && (
        <section id="about" className="py-12 bg-white w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative pb-20 sm:pb-24 md:pb-0">
                <div className="border-4 sm:border-8 md:border-[12px] border-light relative z-10 bg-light">
                  <img 
                    src={safeData.about.image} 
                    alt="مخططات ومستندات مشاريع المقاولات" 
                    className="w-full h-auto object-contain shadow-lg block"
                  />
                </div>
                <div className="absolute bottom-0 left-0 md:-bottom-8 md:-left-8 w-36 h-36 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-accent p-3 sm:p-4 md:p-8 flex flex-col justify-center items-center text-white z-20 shadow-xl">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold">المقاولات</span>
                  <span className="text-center text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wide mt-1 md:mt-2 leading-tight sm:leading-normal">قطاع متخصص</span>
                </div>
              </div>

              <div>
                <span className="text-primary font-bold tracking-widest text-base uppercase mb-3 block">{safeData.about.subtitle}</span>
                <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
                  شركة محاماة متخصصة في قطاع <span className="text-primary">المقاولات</span>
                </h2>
                <div className="space-y-5 text-gray-700 text-lg leading-relaxed font-medium">
                  {safeData.about.description.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-10 space-y-6">
                  {safeData.about.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-white rounded-xl p-6 md:p-8 border-r-4 border-primary flex gap-5 items-start"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                        <HardHat size={28} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                        <p className="text-gray-200 text-base leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>
            </div>

            <div className="mt-10 flex justify-center w-full">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="text-lg px-10 py-4">تواصل معنا</Button>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Divider: About → Services */}
      <section className="py-6 bg-gradient-to-b from-white to-light relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 via-primary/20 to-transparent"></div>
      </section>

      {/* Services Preview Section */}
      {safeData && visibility.services === true && (
        <section id="services" className="py-12 bg-light w-full">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading 
              subtitle={safeData.services.subtitle}
              title={safeData.services.title}
              description={safeData.services.description}
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 mt-16">
              {safeData.services.items.map((service, index) => {
                const ServiceIcon = SERVICE_ICONS[index] || Briefcase;
                return (
                  <div
                    key={index}
                    className="group bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl p-6 text-center border-t-4 border-t-primary flex flex-col h-full"
                  >
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <ServiceIcon size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-secondary mb-3 group-hover:text-primary transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">{service.description}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <Button className="text-lg px-12 py-4">احصل على استشارة</Button>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Divider: Services → Features */}
      {visibility.services === true && visibility.features === true && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />
      )}

      {/* Features Section */}
      {visibility.features === true && (
        <section id="features" className="relative py-12 bg-white w-full border-y border-gray-100 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <img src="/images/service.png" alt="" className="w-full h-full object-cover" aria-hidden="true" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <SectionHeading
              subtitle={safeData.features.subtitle}
              title={safeData.features.title}
              description={safeData.features.description}
            />
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-16">
              {featureItems.map((feature, index) => {
                // Get icon from mapping or use default from FEATURES
                const IconComponent = typeof feature.icon === 'function' ? feature.icon : Briefcase;
                
                return (
                  <div key={index} className="p-10 hover:shadow-xl transition-all duration-300 border border-gray-100 group rounded-xl bg-light hover:bg-white border-r-4 border-primary shadow-sm">
                    <div className="mb-8">
                      <IconComponent className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <div className="h-0.5 w-16 bg-primary/30 mb-6 group-hover:w-24 transition-all"></div>
                    <p className="text-gray-700 text-base leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      <section className="py-6 bg-light relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 via-primary/20 to-transparent"></div>
      </section>

      {/* Clients Section */}
      {visibility.clients === true && (
        <section id="clients" className="py-12 bg-light w-full">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading 
              subtitle={safeData.clients.subtitle}
              title={safeData.clients.title}
              description={safeData.clients.description}
            />
            
            {clients && clients.length > 0 ? (
              <div className="mt-16">
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={24}
                  slidesPerView={1}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      spaceBetween: 16,
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 24,
                    },
                    1280: {
                      slidesPerView: 5,
                      spaceBetween: 24,
                    },
                  }}
                  navigation={{
                    nextEl: '.swiper-button-prev-clients',
                    prevEl: '.swiper-button-next-clients',
                  }}
                  className="clients-swiper"
                >
                  {clients.map((client, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center border border-gray-100 hover:border-primary/30 group h-full"
                      >
                        <div className="w-full h-32 flex items-center justify-center mb-4 overflow-hidden">
                          <img
                            src={client.logo}
                            alt={client.name}
                            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/service.png';
                            }}
                          />
                        </div>
                        <h3 className="text-lg font-bold text-secondary text-center group-hover:text-primary transition-colors">
                          {client.name}
                        </h3>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="flex items-center justify-center gap-3 md:gap-4 mt-8">
                  <div className="swiper-button-next-clients cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="swiper-button-prev-clients cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">لا يوجد عملاء متاحون حالياً</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Divider: Clients → Stats */}
      <section className="py-0 bg-secondary relative w-full">
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 via-primary/30 to-transparent"></div>
      </section>

      {/* Commitment Section */}
      {visibility.stats === true && (
        <section id="commitment" className="relative w-full text-white overflow-hidden min-h-[420px] sm:min-h-[520px] md:min-h-[600px]">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img src="/images/service.png" alt="" className="w-full h-full object-cover opacity-30" aria-hidden="true" />
          </div>
          <div className="absolute inset-0 z-[1]">
            <img
              src={safeData.stats.image}
              alt=""
              className="w-full h-full object-cover opacity-55"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-secondary/65 bg-gradient-to-l from-secondary/85 via-secondary/55 to-secondary/45" />
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-10 py-12 md:py-16">
            <div className="w-full max-w-4xl mx-auto text-center">
              <span className="text-primary font-bold tracking-widest text-sm uppercase mb-3 block">التزامنا</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 md:mb-8 leading-tight text-balance mx-auto">
                {safeData.stats.title}
              </h2>
              <p className="text-gray-100 text-lg sm:text-xl md:text-2xl leading-relaxed mx-auto">
                {safeData.stats.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA Strip */}
      {visibility.cta === true && (
        <section className="py-12 bg-white w-full">
          <div className="container mx-auto px-4 text-center">
            <span className="text-primary text-sm font-bold tracking-widest uppercase mb-3 block">{safeData.cta.subtitle}</span>
            <h2 className="text-4xl font-serif font-bold text-secondary mb-6">{safeData.cta.title}</h2>
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-xl leading-relaxed">
              {safeData.cta.description}
            </p>
            <div className="text-3xl font-bold text-secondary mb-10" dir="ltr">{safeData.cta.phone}</div>
            <a href={`https://wa.me/${safeData.cta.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
              <Button className="text-lg px-12 py-4">{safeData.cta.buttonText}</Button>
            </a>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {visibility.testimonials === true && (
        <section className="py-12 bg-white w-full">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading 
              subtitle={safeData.testimonials.subtitle}
              title={safeData.testimonials.title}
              description={safeData.testimonials.description}
            />
            
            <div className="mt-16">
              <Swiper
                modules={[Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                navigation={{
                  nextEl: '.swiper-button-prev-testimonials',
                  prevEl: '.swiper-button-next-testimonials',
                }}
                className="testimonials-swiper"
              >
                {safeData.testimonials.items.map((testimonial, index) => (
                  <SwiperSlide key={index}>
                    <div className="border border-gray-100 p-10 shadow-sm hover:shadow-xl transition-all text-center rounded-sm bg-gradient-to-l from-accent/5 via-white via-accent/3 to-transparent border-r-4 border-accent h-full">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-8 border-4 border-accent-50">
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-xl font-bold text-secondary mb-1">{testimonial.name}</h3>
                      <p className="text-accent text-xs uppercase font-bold mb-6">{testimonial.role}</p>
                      <p className="text-gray-700 italic leading-relaxed text-lg font-medium mb-6">"{testimonial.content}"</p>
                      <span className="text-sm text-gray-400 block font-medium">{testimonial.date}</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="flex items-center justify-center gap-3 md:gap-4 mt-8">
                <div className="swiper-button-next-testimonials cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="swiper-button-prev-testimonials cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Visual Library Section */}
      {visibility.videos === true && (
        <section id="videos" className="py-12 relative w-full">
          {/* Main Background Gradient - Right to Left across full section - Gold */}
          <div className="absolute inset-0 bg-gradient-to-l from-primary/12 via-primary/6 via-white via-primary/6 to-primary/12 w-full"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <SectionHeading 
              subtitle={safeData.videos.subtitle}
              title={safeData.videos.title}
              description={safeData.videos.description}
            />
          
          {videos && videos.length > 0 ? (
            <div className="mt-16">
              <Swiper
                modules={[Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                navigation={{
                  nextEl: '.swiper-button-prev-videos',
                  prevEl: '.swiper-button-next-videos',
                }}
                className="videos-swiper"
              >
                {videos.map((video, index) => (
                  <SwiperSlide key={index}>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-light rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100 block h-full"
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
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-secondary mb-3 leading-snug group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-end text-sm text-gray-500 mt-4">
                          <span className="text-primary font-bold flex items-center gap-1">
                            شاهد الآن
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="flex items-center justify-center gap-3 md:gap-4 mt-8">
                <div className="swiper-button-next-videos cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="swiper-button-prev-videos cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">لا توجد فيديوهات متاحة حالياً</p>
            </div>
          )}
          
          </div>
        </section>
      )}

      {/* News Section */}
      {visibility.news === true && (
        <section id="news" className="py-12 bg-light w-full">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading 
              subtitle={safeData.news.subtitle}
              title={safeData.news.title}
              description={safeData.news.description}
            />
            
            <div className="mt-16">
              {articles && articles.length > 0 ? (
                <>
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                      },
                    }}
                    navigation={{
                      nextEl: '.swiper-button-prev-articles',
                      prevEl: '.swiper-button-next-articles',
                    }}
                    className="articles-swiper"
                  >
                    {articles.map((article, index) => {
                      const articleIndex = articles.findIndex(a => a.title === article.title);
                      return (
                        <SwiperSlide key={index}>
                          <Link 
                            to={`/article/${articleIndex}`}
                            className="group cursor-pointer bg-gradient-to-l from-accent/5 via-accent/3 to-transparent rounded-lg p-5 md:p-6 border-r-4 border-accent block hover:shadow-xl transition-all duration-300 h-full"
                          >
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
                            <div className="text-base font-bold text-secondary uppercase border-b-2 border-accent/30 group-hover:border-accent pb-1 transition-all inline-block">
                              اقرأ المزيد
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                  <div className="flex items-center justify-center gap-3 md:gap-4 mt-8">
                    <div className="swiper-button-next-articles cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="swiper-button-prev-articles cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">لا توجد مقالات متاحة حالياً</p>
                </div>
              )}
            </div>
            
            {/* View All Articles Button */}
            {articles && articles.length > 3 && (
              <div className="text-center mt-12">
                <Link to="/articles">
                  <Button variant="outline" className="text-lg px-12 py-4">
                    عرض جميع المقالات
                  </Button>
                </Link>
              </div>
            )}
            
          </div>
        </section>
      )}

      {/* FAQ & Image Split */}
      {visibility.faq === true && (
        <section className="bg-white w-full">
          <div className="grid md:grid-cols-2">
            <div className="p-12 md:p-24">
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-3 block">{safeData.faq.subtitle}</span>
              <h2 className="text-4xl font-serif font-bold text-secondary mb-10">{safeData.faq.title}</h2>
              <p className="text-gray-600 mb-10 text-lg">{safeData.faq.description}</p>
              
              <div className="space-y-4">
                {safeData.faq.items.map((item, index) => (
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
      )}

      {/* Contact Section */}
      {visibility.contact === true && (
        <section id="contact" className="py-12 bg-gradient-to-br from-light via-white to-light w-full overflow-x-hidden">
          <div className="container mx-auto px-4 md:px-6 w-full max-w-full">
            <SectionHeading 
              subtitle={safeData.contact.subtitle}
              title={safeData.contact.title}
              description={safeData.contact.description}
            />
            
            <div className="max-w-4xl mx-auto mt-16 w-full">
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-12 w-full">
                <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-primary w-full min-w-0 box-border">
                  <div className="flex items-start gap-3 sm:gap-5 w-full min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-secondary mb-3">المكتب الرئيسي</h3>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">
                        {safeData.contact.address}
                      </p>
                      <a
                        href={mapsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-primary font-bold hover:text-secondary transition-colors"
                      >
                        <MapPin size={18} />
                        <span>افتح الموقع على الخريطة</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-primary w-full min-w-0 box-border">
                  <div className="flex items-start gap-3 sm:gap-5 w-full min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-secondary mb-3">الهاتف</h3>
                      <a href={`tel:${safeData.contact.phone}`} className="text-gray-700 text-lg font-medium hover:text-primary transition-colors" dir="ltr">
                        {safeData.contact.phone}
                      </a>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 bg-[#25D366] text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-[#20BA5A] transition-all duration-300 shadow-md"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        تواصل عبر واتساب
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-primary w-full min-w-0 box-border">
                  <div className="flex items-start gap-3 sm:gap-5 w-full min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-secondary mb-3">البريد الإلكتروني</h3>
                      <a href={`mailto:${safeData.contact.email}`} className="text-gray-700 text-base hover:text-primary transition-colors break-all">
                        {safeData.contact.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-primary w-full min-w-0 box-border">
                  <div className="flex items-start gap-3 sm:gap-5 w-full min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-secondary mb-3">السجل التجاري</h3>
                      <p className="text-gray-700 text-lg font-medium" dir="ltr">
                        {safeData.contact.commercialRegistration}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-primary w-full min-w-0 box-border">
                  <div className="flex items-start gap-3 sm:gap-5 w-full min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-secondary mb-4">وسائل التواصل</h3>
                      <div className="flex gap-3 flex-wrap">
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#25D366] text-white flex items-center justify-center rounded-lg hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110 shadow-md">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                        </a>
                        <a href="https://x.com/msfr_82" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-110 shadow-md">
                          <Twitter size={24} />
                        </a>
                        <a href="https://www.youtube.com/@mesfer0000" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-110 shadow-md">
                          <Youtube size={24} />
                        </a>
                        <a href="https://www.tiktok.com/@msfr_82" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-110 shadow-md">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                        </a>
                        <a href="https://www.snapchat.com/add/mesferr25" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#FFFC00] text-black flex items-center justify-center rounded-lg hover:bg-[#FFF200] transition-all duration-300 hover:scale-110 shadow-md">
                          <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2c-3.1 0-5.6 2.5-5.6 5.6v2.2c0 .3-.1.5-.3.7-.7.6-2.1 1.5-2.1 2.3 0 .5.4.9 1.2 1.1.9.2 1.4.3 1.6.6.2.3.2.9.2 1.4 0 .5.3.9.8 1 .7.1 1.5.2 2.1.6.6.4 1.1 1.2 2.1 1.2s1.5-.8 2.1-1.2c.6-.4 1.4-.5 2.1-.6.5-.1.8-.5.8-1 0-.5 0-1.1.2-1.4.2-.3.7-.4 1.6-.6.8-.2 1.2-.6 1.2-1.1 0-.8-1.4-1.7-2.1-2.3-.2-.2-.3-.4-.3-.7V7.6C17.6 4.5 15.1 2 12 2z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button - Large and Prominent */}
              {/* Map */}
              <div className="mt-8 w-full min-w-0">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full">
                  <div className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100">
                    <div className="min-w-0 flex-1 w-full">
                      <h3 className="text-xl sm:text-2xl font-bold text-secondary">موقع المكتب على الخريطة</h3>
                      <p className="text-gray-600 mt-2 text-sm sm:text-base break-words">{safeData.contact.address}</p>
                    </div>
                    <a
                      href={mapsAppHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:bg-secondary transition-colors"
                    >
                      <MapPin size={18} />
                      <span>فتح في خرائط Google</span>
                    </a>
                  </div>
                  <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                    <iframe
                      title="خريطة الموقع"
                      src={mapEmbedSrc}
                      width="100%"
                      height="100%"
                      className="absolute inset-0 w-full h-full border-0"
                      loading="lazy"
                      allowFullScreen={true}
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ border: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110 active:scale-95 group animate-bounce-slow"
        aria-label="تواصل معنا عبر واتساب"
      >
        <svg
          className="w-7 h-7 md:w-8 md:h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg pointer-events-none">
          تواصل معنا
          <span className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></span>
        </span>
      </a>
    </>
  );
};

export default Home;

