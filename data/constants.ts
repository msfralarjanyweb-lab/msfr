import {
  Users,
  TrendingUp,
  Gavel,
  Clock,
  FileCheck,
  Building2,
  Target,
  Shield,
  Scale,
} from 'lucide-react';
import { Service, Feature } from '../types';

export const SERVICES: Service[] = [
  {
    title: 'الاستشارات القانونية',
    description:
      'استشارات قانونية متخصصة في جميع جوانب المشاريع الإنشائية خلال جميع مراحل المشروع.',
    image: '/images/service.png',
  },
  {
    title: 'إدارة المخاطر والامتثال',
    description:
      'تقديم استشارات لإدارة المخاطر القانونية وضمان الامتثال للأنظمة واللوائح ذات العلاقة بالمشاريع.',
    image: '/images/service.png',
  },
  {
    title: 'النزاعات والتحكيم',
    description:
      'حل النزاعات الهندسية والتعاهدية من خلال الوسائل الودية أو التحكيم المحلي والدولي لقطاع الإنشاءات.',
    image: '/images/service.png',
  },
  {
    title: 'التأخير والتمديد',
    description:
      'تحليل أسباب التأخير وإعداد مطالبات التمديد والتكاليف الإضافية والدفاع باستراتيجية قانونية فعالة.',
    image: '/images/service.png',
  },
  {
    title: 'المطالبات والتعويضات',
    description:
      'إعداد ومراجعة وصياغة عقود المقاولات والمناقصات وكافة الملحقات والشروط الخاصة وحماية مصالح العملاء.',
    image: '/images/service.png',
  },
];

export const FEATURES: Feature[] = [
  {
    title: 'فهم طبيعة المشاريع',
    description:
      'نفهم التحديات التشغيلية والفنية والمالية ونترجمها إلى حلول قانونية.',
    icon: Building2,
  },
  {
    title: 'حلول عملية وفعالة',
    description: 'نقدم حلول قانونية تراعي طبيعة المشروع وتحقق أفضل النتائج.',
    icon: Target,
  },
  {
    title: 'حماية مصالحك',
    description: 'نضع مصالحك في المقام الأول ونعمل على حماية حقوقك وتقليل المخاطر.',
    icon: Shield,
  },
  {
    title: 'خبرة في الأنظمة والعقود',
    description:
      'إلمام كامل بالأنظمة السعودية والدولية والعقود القياسية في قطاع الإنشاءات.',
    icon: Scale,
  },
  {
    title: 'فريق متخصص',
    description:
      'محامون ومستشارون ذوو خبرة عملية عميقة في قطاع المقاولات والمشاريع الكبرى.',
    icon: Users,
  },
];

export const SERVICE_ICONS = [Users, TrendingUp, Gavel, Clock, FileCheck];
