import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { NavItem } from '../types';

const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'مجالات الممارسة', href: '#services' },
  { label: 'المكتبة المرئية', href: '#videos' },
  { label: 'من نحن', href: '#about' },
  { label: 'المقالات', href: '#news' },
  { label: 'اتصل بنا', href: '#contact' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'videos', 'about', 'news', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
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
    <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }} className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <img src="/images/logo.png" alt="شعار شركة مسفر محمد العرجاني" className="h-10 w-auto sm:h-12 md:h-16 lg:h-20" />
            <div className="block text-right">
              <h1 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-secondary leading-tight">شركة مسفر محمد العرجاني</h1>
              <span className="text-[10px] sm:text-xs md:text-sm text-primary font-medium tracking-wide">للمحاماة والاستشارات القانونية</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.label} 
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className={`text-gray-700 hover:text-primary font-bold text-base transition-colors uppercase tracking-wider ${
                  activeSection === item.href ? 'text-primary' : ''
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Contact & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a href="tel:+966509579993" className="hidden lg:flex items-center gap-2 text-secondary font-bold text-lg">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary">
                <Phone size={20} />
              </div>
              <span dir="ltr">+966509579993</span>
            </a>
            <button 
              className="md:hidden text-secondary p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 shadow-lg p-4">
          <nav className="flex flex-col space-y-4">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.label} 
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className={`text-dark hover:text-primary font-bold text-lg py-3 border-b border-gray-50 last:border-0 ${
                  activeSection === item.href ? 'text-primary' : ''
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

