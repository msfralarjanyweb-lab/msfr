import React from 'react';
import { MapPin, Mail, Clock, Facebook, Twitter, Youtube } from 'lucide-react';
import Button from './Button';
import { NavItem } from '../types';
import { useData } from '../contexts/DataContext';

const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'مجالات الممارسة', href: '#services' },
  { label: 'المكتبة المرئية', href: '#videos' },
  { label: 'من نحن', href: '#about' },
  { label: 'المقالات', href: '#news' },
  { label: 'اتصل بنا', href: '#contact' },
];

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

const Footer: React.FC = () => {
  const contextData = useData();
  const data = contextData?.data;
  const address = data?.contact?.address || 'طريق الملك فهد، الرياض، المملكة العربية السعودية';
  const email = data?.contact?.email || 'info@al-arjani-law.com';

  return (
    <footer className="bg-secondary text-white pt-24 pb-12 border-t border-secondary-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          
          {/* Column 1: Intro */}
          <div className="md:col-span-1">
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }} className="flex items-center gap-4 mb-8">
              <img src="/images/logo.png" alt="شعار" className="h-24 w-auto" />
              <h3 className="text-2xl font-bold font-serif leading-none">
                مسفر محمد <br />العرجاني
              </h3>
            </a>
            <p className="text-gray-300 text-base leading-relaxed mb-8">
              توفر شركتنا مجموعة كاملة من الخدمات القانونية للأفراد والشركات في المملكة العربية السعودية، مع الالتزام بأعلى معايير المهنية.
            </p>
            <div className="flex gap-4 flex-wrap">
               <a href="#" className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors"><Facebook size={20} /></a>
               <a href="https://x.com/msfr_82" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors"><Twitter size={20} /></a>
               <a href="https://www.youtube.com/@mesfer0000" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors"><Youtube size={20} /></a>
               <a href="https://www.tiktok.com/@msfr_82" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                 </svg>
               </a>
               <a href="https://www.snapchat.com/add/mesferr25" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12.166 1c-5.94 0-10.75 4.81-10.75 10.75 0 4.56 2.87 8.45 6.9 10.01-.09-.81-.17-2.07.04-2.96.21-.81 1.29-5.15 1.29-5.15s-.33-.62-.33-1.54c0-1.44.89-2.52 2-2.52.95 0 1.4.67 1.4 1.46 0 .89-.6 2.22-.92 3.46-.26 1.03.55 1.87 1.64 1.87 1.97 0 3.48-1.94 3.48-4.75 0-2.48-1.91-4.22-4.63-4.22-3.15 0-5 2.22-5 4.5 0 .89.36 1.85.82 2.37.09.1.1.2.08.3-.09.32-.27 1.04-.31 1.18-.05.19-.16.23-.37.14-1.38-.6-2.25-2.49-2.25-4.02 0-3.27 2.54-6.27 7.33-6.27 3.85 0 6.84 2.57 6.84 5.99 0 3.58-2.41 6.46-5.77 6.46-1.12 0-2.18-.54-2.54-1.19l-.69 2.47c-.25.96-.93 2.03-1.38 2.91.95.28 1.93.43 2.93.43 5.94 0 10.75-4.81 10.75-10.75C22.916 5.81 18.106 1 12.166 1z"/>
                 </svg>
               </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xl font-bold mb-8">التنقل</h4>
            <ul className="space-y-4 text-base text-gray-300">
              {NAV_ITEMS.map(item => (
                <li key={item.label}>
                  <a href={item.href} onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }} className="hover:text-primary transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-8">روابط سريعة</h4>
            <ul className="space-y-4 text-base text-gray-300">
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }} className="hover:text-primary transition-colors">حجز موعد</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="hover:text-primary transition-colors">الشركات والأوراق المالية</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="hover:text-primary transition-colors">قانون العقارات</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="hover:text-primary transition-colors">القضايا الجنائية</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="hover:text-primary transition-colors">التراخيص والاستثمار</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Contact */}
          <div>
            <h4 className="text-xl font-bold mb-8">اشترك في نشرتنا</h4>
            <p className="text-gray-300 text-sm mb-6">* اشترك ليصلك كل جديد في عالم القانون والأنظمة.</p>
            <div className="space-y-4">
               <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="w-full bg-secondary-light border border-secondary-dark p-4 text-base text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
              <Button className="w-full py-3">اشترك</Button>
            </div>
          </div>
        </div>
        
        {/* Contact Strip */}
        <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-secondary-dark gap-10">
          <div className="flex items-center gap-5">
            <MapPin className="text-primary w-8 h-8" />
            <div>
              <h5 className="font-bold text-lg">المكتب الرئيسي</h5>
              <p className="text-gray-400 text-sm">{address}</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Mail className="text-primary w-8 h-8" />
            <div>
              <h5 className="font-bold text-lg">البريد الإلكتروني</h5>
              <p className="text-gray-400 text-sm">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
             <Clock className="text-primary w-8 h-8" />
            <div>
              <h5 className="font-bold text-lg">ساعات العمل</h5>
              <p className="text-gray-400 text-sm">الأحد - الخميس: 9 ص - 6 م</p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center pt-10 border-t border-secondary-dark text-sm text-white">
جميع الحقوق محفوظة | شركة مسفر محمد العرجاني للمحاماة &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

