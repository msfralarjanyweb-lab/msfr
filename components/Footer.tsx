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
                   <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.199-.937 1.328-5.951 1.328-5.951s-.339-.68-.339-1.661c0-1.549.857-2.743 1.923-2.743.908 0 1.345.653 1.345 1.44 0 .914-.582 2.28-.881 3.54-.251 1.062.535 1.925 1.59 1.925 1.908 0 3.37-2.01 3.37-4.913 0-2.58-1.857-4.38-4.51-4.38-3.07 0-4.98 2.257-4.98 4.59 0 .91.35 1.89.8 2.42.088.106.1.199.074.306-.08.315-.258.99-.293 1.13-.047.188-.155.23-.36.14-1.35-.62-2.19-2.57-2.19-4.14 0-3.38 2.46-6.48 7.09-6.48 3.72 0 6.6 2.58 6.6 6.01 0 3.46-2.18 6.24-5.21 6.24-1.02 0-1.98-.52-2.31-1.23l-.63 2.39c-.23.93-.85 2.01-1.27 2.69.95.29 1.95.44 2.98.44 6.624 0 11.99-5.367 11.99-11.987C23.97 5.39 18.592.026 11.968.026L12.017 0z"/>
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

