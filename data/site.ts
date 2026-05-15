import { SERVICES, FEATURES } from './constants';
import type { Service, Feature, Testimonial, FAQItem, Article, VideoItem, Client } from '../types';

export interface SectionVisibility {
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
  clients: boolean;
}

export interface SiteData {
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
    features: Array<{ title: string; description: string }>;
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
    commercialRegistration: string;
  };
  clients: {
    subtitle: string;
    title: string;
    description: string;
    items: Client[];
  };
  visibility: SectionVisibility;
}

export const CLIENTS: Client[] = [];

export const siteData: SiteData = {
  hero: {
    badge: 'شركة مسفر محمد العرجاني',
    title: 'للمحاماة والاستشارات',
    titleHighlight: 'القانونية',
    description:
      'شركة محاماة متخصصة في قطاع المقاولات. نقدم حلولاً قانونية دقيقة وفعالة لشركات المشاريع والجهات المالكة والمطورين العقاريين.',
    button1Text: 'اطلب استشارة',
    button2Text: 'تعرف علينا',
    image: '/images/lawyer.jpg',
    lawyerName: 'مسفر محمد العرجاني',
    lawyerTitle1: 'للمحاماة والاستشارات القانونية',
    lawyerTitle2: 'متخصصون في قطاع المقاولات',
  },
  about: {
    subtitle: 'من نحن',
    title: 'شركة محاماة متخصصة في قطاع المقاولات',
    description:
      'نحن شركة قانونية متخصصة في تقديم الحلول القانونية لقطاع المقاولات، وشركات المشاريع، والجهات المالكة، والمطورين العقاريين، بخبرة عميقة في العقود الإنشائية وإدارة المخاطر وحل النزاعات.\n\nنقدم خدمات قانونية دقيقة وفعالة تدعم نجاح مشاريعكم وتحمي مصالحكم في جميع مراحل المشروع.',
    image: '/images/lawyer2.jpg',
    features: [
      {
        title: 'نحن نفهم قطاع المقاولات ونتحدث لغة المشاريع',
        description:
          'نركز على تقديم استشارات وحلول قانونية متخصصة تلبي احتياجات المقاولين وشركات المقاولات في جميع مراحل المشروع: من التعاقد وحتى التسليم وما بعده.',
      },
    ],
  },
  services: {
    subtitle: 'خدماتنا',
    title: 'خدماتنا القانونية المتخصصة في قطاع المقاولات',
    description: '',
    items: SERVICES,
  },
  stats: {
    clients: '',
    compensation: '',
    experience: '',
    successRate: '',
    title: 'التزامنا',
    description:
      'نلتزم بأعلى معايير المهنية والسرية، ونعمل كشريك استراتيجي للمقاولين وشركات المقاولات لحماية حقوقهم وتحقيق نجاح مشاريعهم بثقة وطمأنينة.',
    image: '/images/lawyer3.jpg',
  },
  cta: {
    subtitle: 'تواصل معنا',
    title: 'احجز استشارة قانونية',
    description: 'نحن هنا لمساعدتكم في جميع مراحل مشروعكم.',
    phone: '+966553553042',
    buttonText: 'تواصل عبر واتساب',
  },
  features: {
    subtitle: 'لماذا نحن',
    title: 'لماذا تختارنا؟',
    description: '',
    items: FEATURES,
  },
  testimonials: {
    subtitle: '',
    title: '',
    description: '',
    items: [],
  },
  videos: {
    subtitle: '',
    title: '',
    description: '',
    items: [],
  },
  news: {
    subtitle: '',
    title: '',
    description: '',
    items: [],
  },
  faq: {
    subtitle: '',
    title: '',
    description: '',
    items: [],
  },
  contact: {
    subtitle: 'بيانات التواصل',
    title: 'تواصل معنا',
    description: '',
    address: 'مخرج 17 – تقاطع الدائري الشرقي مع طريق المدينة المنورة – الرياض',
    phone: '+966553553042',
    email: 'info@al-arjani-law.com',
    commercialRegistration: '7051123235',
  },
  clients: {
    subtitle: '',
    title: '',
    description: '',
    items: CLIENTS,
  },
  visibility: {
    hero: true,
    about: true,
    services: true,
    stats: true,
    cta: false,
    features: true,
    testimonials: false,
    videos: false,
    news: false,
    faq: false,
    contact: true,
    clients: false,
  },
};
