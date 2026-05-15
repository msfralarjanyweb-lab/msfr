import React from 'react';
import { MapPin, Facebook, Twitter, Youtube } from 'lucide-react';
import { NavItem } from '../types';
import { useData } from '../contexts/DataContext';

const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'من نحن', href: '#about' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'لماذا تختارنا', href: '#features' },
  { label: 'التزامنا', href: '#commitment' },
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
      behavior: 'smooth',
    });
  }
};

const Footer: React.FC = () => {
  const { data } = useData();
  const address = data.contact.address;

  return (
    <footer className="bg-secondary text-white pt-24 pb-12 border-t border-secondary-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="flex items-center gap-4 mb-8"
            >
              <img src="/images/logo.png" alt="شعار" className="h-24 w-auto" />
              <h3 className="text-2xl font-bold font-serif leading-none">
                مسفر محمد <br />
                العرجاني
              </h3>
            </a>
            <p className="text-gray-300 text-base leading-relaxed mb-8">
              شركة محاماة متخصصة في قطاع المقاولات. نقدم حلولاً قانونية دقيقة لشركات المشاريع والجهات
              المالكة والمطورين العقاريين في جميع مراحل المشروع.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#" className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com/msfr_82"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.youtube.com/@mesfer0000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@msfr_82"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://www.snapchat.com/add/mesferr25"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-light flex items-center justify-center rounded hover:bg-primary transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2c-3.1 0-5.6 2.5-5.6 5.6v2.2c0 .3-.1.5-.3.7-.7.6-2.1 1.5-2.1 2.3 0 .5.4.9 1.2 1.1.9.2 1.4.3 1.6.6.2.3.2.9.2 1.4 0 .5.3.9.8 1 .7.1 1.5.2 2.1.6.6.4 1.1 1.2 2.1 1.2s1.5-.8 2.1-1.2c.6-.4 1.4-.5 2.1-.6.5-.1.8-.5.8-1 0-.5 0-1.1.2-1.4.2-.3.7-.4 1.6-.6.8-.2 1.2-.6 1.2-1.1 0-.8-1.4-1.7-2.1-2.3-.2-.2-.3-.4-.3-.7V7.6C17.6 4.5 15.1 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">التنقل</h4>
            <ul className="space-y-4 text-base text-gray-300">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">خدماتنا</h4>
            <ul className="space-y-4 text-base text-gray-300">
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="hover:text-primary transition-colors">
                  الاستشارات القانونية
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="hover:text-primary transition-colors">
                  إدارة المخاطر والامتثال
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="hover:text-primary transition-colors">
                  النزاعات والتحكيم
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="hover:text-primary transition-colors">
                  التأخير والتمديد
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="hover:text-primary transition-colors">
                  المطالبات والتعويضات
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">بيانات التواصل</h4>
            <ul className="space-y-4 text-base text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                <span>{address}</span>
              </li>
              <li>
                <a href={`tel:${data.contact.phone}`} className="hover:text-primary transition-colors" dir="ltr">
                  {data.contact.phone}
                </a>
              </li>
              <li>
                <span>السجل التجاري: {data.contact.commercialRegistration}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-10 border-t border-secondary-dark text-sm text-white">
          جميع الحقوق محفوظة | شركة مسفر محمد العرجاني للمحاماة &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;


