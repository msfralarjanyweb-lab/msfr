import { 
  Briefcase, Users, Clock, Scale, Gavel, Shield
} from 'lucide-react';
import { NavItem, Service, Feature, Testimonial, FAQItem, Article, VideoItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  { label: 'مجالات الممارسة', href: '/services' },
  { label: 'المكتبة المرئية', href: '/videos' },
  { label: 'من نحن', href: '/about' },
  { label: 'المقالات', href: '/news' },
  { label: 'اتصل بنا', href: '/contact' },
];

export const SERVICES: Service[] = [
  {
    title: 'خدمات خاصة بالشركات',
    description: 'نقدم خدمات قانونية متخصصة للشركات تشمل الاستشارات القانونية، صياغة العقود، والتمثيل القانوني في جميع المعاملات التجارية.',
    image: '/images/service.png',
  },
  {
    title: 'كتابة المذكرات واللوائح',
    description: 'خدمات احترافية في كتابة المذكرات القانونية واللوائح الدفاعية والطلبات القضائية بدقة عالية ومهنية تامة.',
    image: '/images/service.png',
  },
  {
    title: 'خدمات خاصة بالعملاء أمام المحاكم القضائية',
    description: 'تمثيل قانوني كامل للعملاء أمام جميع المحاكم القضائية مع متابعة دقيقة للقضايا والدفاع المستمر عن حقوقهم.',
    image: '/images/service.png'
  }
];

export const FEATURES: Feature[] = [
  {
    title: 'استشارة مجانية',
    description: 'نقدم استشارة أولية مجانية لتقييم حالتك وفهم احتياجاتك القانونية بدقة.',
    icon: Briefcase
  },
  {
    title: 'خبرة عريقة',
    description: 'أكثر من 25 عاماً من النجاح المستمر في مختلف المحاكم والجهات القضائية.',
    icon: Users
  },
  {
    title: 'استجابة سريعة',
    description: 'نلتزم بالرد الفوري على استفسارات عملائنا وإبقائهم على اطلاع دائم.',
    icon: Clock
  },
  {
    title: 'خدمات متنوعة',
    description: 'تغطية قانونية شاملة لكافة المجالات التجارية، المدنية، والجنائية.',
    icon: Scale
  },
  {
    title: 'ثقة ومصداقية',
    description: 'بنينا سمعتنا على النزاهة والشفافية المطلقة مع جميع عملائنا.',
    icon: Gavel
  },
  {
    title: 'رضا العملاء',
    description: 'نفخر بنسبة رضا عالية جداً وسجل حافل من القضايا الناجحة.',
    icon: Shield
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'خالد العمري',
    role: 'الرئيس التنفيذي، شركة نماء',
    content: 'لم أجد كلمات تصف العمل الرائع الذي قدمه فريق الشركة. تعاملوا مع قضيتنا المعقدة باحترافية عالية وحققوا نتائج مذهلة.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    date: '15 أكتوبر 2024'
  },
  {
    name: 'محمد العتيبي',
    role: 'رائد أعمال',
    content: 'منذ اللحظة الأولى شعرت بالثقة. وضوح في الإجراءات، دقة في المواعيد، ودعم مستمر طوال فترة القضية.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    date: '20 سبتمبر 2024'
  },
  {
    name: 'فيصل الدوسري',
    role: 'مدير عقارات',
    content: 'أفضل شركة محاماة تعاملت معها. الاهتمام بالتفاصيل الصغيرة هو ما يميزهم عن غيرهم.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    date: '02 أغسطس 2024'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'أي محامي في شركتكم هو الأفضل لقضيتي؟',
    answer: 'نقوم بتعيين المحامي الأنسب بناءً على نوع القضية وخبرة المحامي في ذلك المجال المحدد لضمان أفضل النتائج.'
  },
  {
    question: 'ما هي التكاليف المتوقعة للخدمات القانونية؟',
    answer: 'نعتمد مبدأ الشفافية التامة. سيتم توضيح كافة الرسوم والآتعاب في عقد الاتفاق قبل البدء بأي إجراء.'
  },
  {
    question: 'كيف سيتم إطلاعي على مستجدات قضيتي؟',
    answer: 'نلتزم بتحديثات دورية عبر الهاتف أو البريد الإلكتروني، بالإضافة إلى تقارير شهرية عن سير العمل.'
  },
  {
    question: 'هل تقدمون استشارات عبر الإنترنت؟',
    answer: 'نعم، نوفر خدمة الاستشارات المرئية عبر الإنترنت لتسهيل التواصل مع عملائنا من أي مكان.'
  }
];

export const ARTICLES: Article[] = [
  {
    title: 'الحرب على الفساد وآثارها القانونية',
    excerpt: 'في هذا المقال، نناقش التطورات الأخيرة في أنظمة مكافحة الفساد وتأثيرها على بيئة الأعمال.',
    date: '18 أكتوبر 2024',
    category: 'أخبار',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'سياسات حماية الأجور الجديدة',
    excerpt: 'شرح مفصل للتعديلات الجديدة على نظام العمل والعمال فيما يخص حماية الأجور وحقوق الموظفين.',
    date: '14 سبتمبر 2024',
    category: 'نصائح',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'أهمية العقود التجارية للشركات الناشئة',
    excerpt: 'لماذا يجب على كل شركة ناشئة الاهتمام بصياغة عقود محكمة منذ اليوم الأول.',
    date: '22 أغسطس 2024',
    category: 'شركات',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }
];

export const FALLBACK_VIDEOS: VideoItem[] = [
  {
    title: 'شرح نظام الشركات الجديد في السعودية',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '04:20',
    views: '1.2K مشاهدة',
    url: 'https://www.tiktok.com/@msfr_82'
  },
  {
    title: 'حقوق الموظف في حالة الفصل التعسفي',
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-79858cf27acc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '03:15',
    views: '3.5K مشاهدة',
    url: 'https://www.tiktok.com/@msfr_82'
  },
  {
    title: 'كيف تحمي حقوق الملكية الفكرية لمشروعك؟',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '05:45',
    views: '900 مشاهدة',
    url: 'https://www.tiktok.com/@msfr_82'
  }
];

export const TIKTOK_USERNAME = 'msfr_82';

