import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// معلومات الاتصال بقاعدة البيانات
// يجب إضافة DATABASE_URL في ملف .env
const connectionString = process.env.DATABASE_URL || '';

// البيانات الافتراضية
const defaultSiteData = {
  hero: {
    badge: 'شركة محاماة رائدة',
    title: 'استخدم خبرتنا',
    titleHighlight: 'القانونية الفعالة',
    description: 'ندافع عن حقوقك ونساعدك على النجاح. فريقنا المتخصص يضمن لك أفضل تمثيل قانوني في كافة القضايا التجارية والشخصية.',
    button1Text: 'اطلب استشارة',
    button2Text: 'تعرف علينا',
    image: '/images/lawyer.png',
    lawyerName: 'مسفر محمد العرجاني',
    lawyerTitle1: 'عضو اساسي في هيئة المحامين',
    lawyerTitle2: 'مسجل عيني للعقار',
  },
  about: {
    subtitle: 'عن شركة مسفر محمد العرجاني',
    title: 'خبرة قانونية راسخة عبر سنوات من الممارسة',
    description: 'مكتبنا للمحاماة محترف ومكرس لمساعدة العملاء على حل المشكلات وتحقيق الأهداف. نقدم مجموعة كاملة من الخدمات للتعامل مع القضايا القانونية من أي تعقيد للأفراد والشركات والمنظمات الكبيرة.',
    image: '/images/lawyer2.png',
    features: [
      {
        title: 'رفع القضايا وكتابة المذكرات القانونية وحضور الجلسات',
        description: 'نقدم خدمات رفع القضايا وكتابة المذكرات القانونية وحضور الجلسات للأفراد والشركات والمنظمات الكبيرة.',
      },
      {
        title: 'استشارات قانونية ودراسة المستندات والعقود',
        description: 'نقدم خدمات استشارات قانونية ودراسة المستندات والعقود للأفراد والشركات والمنظمات الكبيرة.',
      },
    ],
  },
  services: {
    subtitle: 'كيف يمكننا مساعدتك',
    title: 'منظومة خدماتنا القانونية',
    description: 'مهما كانت قضيتك، يمكننا مساعدتك فيها بفضل خبرتنا الواسعة.',
    items: [
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
        image: '/images/service.png',
      },
    ],
  },
  stats: {
    clients: '978',
    compensation: '66 M',
    experience: '25',
    successRate: '99%',
    title: 'نقدم حلولاً فعالة آمنة ومستدامة.',
    description: 'القانون في صفك، ثق بنا! سيقوم فريق المحامين ذوي الخبرة لدينا بإثبات ذلك ومساعدتك على النجاح في قضيتك.',
    image: '/images/lawyer3.png',
  },
  cta: {
    subtitle: 'استشارة',
    title: 'احجز استشارة قانونية',
    description: 'سندرس حالتك ونوضح لك الخيارات القانونية المتاحة. اتصل بنا اليوم لتبدأ الخطوة الأولى.',
    phone: '+966509579993',
    buttonText: 'أرسل طلباً',
  },
  features: {
    subtitle: 'لماذا تختارنا',
    title: 'أهم المميزات',
    description: 'إليك بضعة أسباب فقط للعمل مع شركة مسفر محمد العرجاني للمحاماة والاستشارات.',
    items: [],
  },
  testimonials: {
    subtitle: 'آراء العملاء',
    title: 'ماذا يقول عملاؤنا',
    description: 'نعتز بثقة عملائنا ونسعى دائماً لتحقيق أفضل النتائج لهم.',
    items: [],
  },
  videos: {
    subtitle: 'المكتبة المرئية',
    title: 'فيديوهات توعوية وقانونية',
    description: 'تابع أحدث الشروحات القانونية والأخبار عبر قنواتنا على وسائل التواصل الاجتماعي.',
    items: [
      {
        title: 'شرح نظام الشركات الجديد في السعودية',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        duration: '04:20',
        views: '1.2K مشاهدة',
        url: 'https://www.tiktok.com/@msfr_82',
      },
      {
        title: 'حقوق الموظف في حالة الفصل التعسفي',
        thumbnail: 'https://images.unsplash.com/photo-1521791136064-79858cf27acc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        duration: '03:15',
        views: '3.5K مشاهدة',
        url: 'https://www.tiktok.com/@msfr_82',
      },
      {
        title: 'كيف تحمي حقوق الملكية الفكرية لمشروعك؟',
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        duration: '05:45',
        views: '900 مشاهدة',
        url: 'https://www.tiktok.com/@msfr_82',
      },
    ],
  },
  news: {
    subtitle: 'الأخبار',
    title: 'اقرأ مقالاتنا',
    description: 'في مدونتنا، نناقش أحدث القضايا والتحليلات القانونية في المملكة.',
    items: [],
  },
  faq: {
    subtitle: 'الأسئلة الشائعة',
    title: 'هل لا يزال لديك أي أسئلة؟',
    description: 'فيما يلي الإجابات على الأسئلة الأكثر شيوعاً التي تردنا من العملاء:',
    items: [
      {
        question: 'أي محامي في شركتكم هو الأفضل لقضيتي؟',
        answer: 'نقوم بتعيين المحامي الأنسب بناءً على نوع القضية وخبرة المحامي في ذلك المجال المحدد لضمان أفضل النتائج.',
      },
      {
        question: 'ما هي التكاليف المتوقعة للخدمات القانونية؟',
        answer: 'نعتمد مبدأ الشفافية التامة. سيتم توضيح كافة الرسوم والآتعاب في عقد الاتفاق قبل البدء بأي إجراء.',
      },
      {
        question: 'كيف سيتم إطلاعي على مستجدات قضيتي؟',
        answer: 'نلتزم بتحديثات دورية عبر الهاتف أو البريد الإلكتروني، بالإضافة إلى تقارير شهرية عن سير العمل.',
      },
      {
        question: 'هل تقدمون استشارات عبر الإنترنت؟',
        answer: 'نعم، نوفر خدمة الاستشارات المرئية عبر الإنترنت لتسهيل التواصل مع عملائنا من أي مكان.',
      },
    ],
  },
  contact: {
    subtitle: 'اتصل بنا',
    title: 'نحن هنا لمساعدتك',
    description: 'تواصل معنا اليوم واحصل على استشارة قانونية مجانية',
    address: 'طريق الملك فهد، الرياض، المملكة العربية السعودية',
    phone: '+966509579993',
    email: 'info@al-arjani-law.com',
  },
  visibility: {
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
  },
};

const defaultArticles = [
  {
    title: 'الحرب على الفساد وآثارها القانونية',
    excerpt: 'في هذا المقال، نناقش التطورات الأخيرة في أنظمة مكافحة الفساد وتأثيرها على بيئة الأعمال.',
    content: 'في هذا المقال، نناقش التطورات الأخيرة في أنظمة مكافحة الفساد وتأثيرها على بيئة الأعمال.\n\nلقد شهدت المملكة العربية السعودية في السنوات الأخيرة تطورات كبيرة في مجال مكافحة الفساد، حيث تم إطلاق العديد من المبادرات والأنظمة القانونية الجديدة التي تهدف إلى تعزيز الشفافية والنزاهة في جميع القطاعات.\n\nمن أهم هذه التطورات:\n\n1. تعزيز دور هيئة الرقابة ومكافحة الفساد\n2. إصدار أنظمة جديدة لمكافحة الفساد المالي والإداري\n3. تطوير آليات الإبلاغ عن الفساد\n4. تعزيز الشفافية في التعاقدات الحكومية\n\nهذه التطورات لها تأثير كبير على بيئة الأعمال، حيث أصبحت الشركات مطالبة باتباع معايير أعلى من الشفافية والنزاهة في تعاملاتها.',
    date: '18 أكتوبر 2024',
    category: 'أخبار',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'سياسات حماية الأجور الجديدة',
    excerpt: 'شرح مفصل للتعديلات الجديدة على نظام العمل والعمال فيما يخص حماية الأجور وحقوق الموظفين.',
    content: 'شرح مفصل للتعديلات الجديدة على نظام العمل والعمال فيما يخص حماية الأجور وحقوق الموظفين.\n\nأصدرت وزارة الموارد البشرية والتنمية الاجتماعية مؤخراً تعديلات مهمة على نظام العمل والعمال تهدف إلى تعزيز حماية حقوق الموظفين وضمان حصولهم على أجورهم في الوقت المحدد.\n\nمن أهم التعديلات:\n\n• إلزام أصحاب العمل بدفع الأجور في المواعيد المحددة\n• فرض عقوبات صارمة على المخالفين\n• إنشاء نظام إلكتروني لمتابعة حالات التأخير في دفع الأجور\n• تعزيز آليات التظلم للموظفين\n\nهذه التعديلات تعكس التزام المملكة بحماية حقوق العمال وضمان بيئة عمل عادلة ومنصفة للجميع.',
    date: '14 سبتمبر 2024',
    category: 'نصائح',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'أهمية العقود التجارية للشركات الناشئة',
    excerpt: 'لماذا يجب على كل شركة ناشئة الاهتمام بصياغة عقود محكمة منذ اليوم الأول.',
    content: 'لماذا يجب على كل شركة ناشئة الاهتمام بصياغة عقود محكمة منذ اليوم الأول.\n\nالعقود التجارية هي العمود الفقري لأي عمل تجاري ناجح. بالنسبة للشركات الناشئة، فإن وجود عقود محكمة ومنظمة منذ البداية يمكن أن يوفر الكثير من الوقت والمال والمشاكل القانونية في المستقبل.\n\nالفوائد الرئيسية للعقود المحكمة:\n\n1. حماية حقوق جميع الأطراف\n2. توضيح الالتزامات والمسؤوليات\n3. تقليل النزاعات والخلافات\n4. بناء الثقة مع الشركاء والعملاء\n5. تسهيل عملية النمو والتوسع\n\nننصح جميع الشركات الناشئة بالاستعانة بمحامٍ متخصص في صياغة العقود التجارية لضمان حماية مصالحها.',
    date: '22 أغسطس 2024',
    category: 'شركات',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
];

const defaultTestimonials = [
  {
    name: 'خالد العمري',
    role: 'الرئيس التنفيذي، شركة نماء',
    content: 'لم أجد كلمات تصف العمل الرائع الذي قدمه فريق الشركة. تعاملوا مع قضيتنا المعقدة باحترافية عالية وحققوا نتائج مذهلة.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    date: '15 أكتوبر 2024',
  },
  {
    name: 'محمد العتيبي',
    role: 'رائد أعمال',
    content: 'منذ اللحظة الأولى شعرت بالثقة. وضوح في الإجراءات، دقة في المواعيد، ودعم مستمر طوال فترة القضية.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    date: '20 سبتمبر 2024',
  },
  {
    name: 'فيصل الدوسري',
    role: 'مدير عقارات',
    content: 'أفضل شركة محاماة تعاملت معها. الاهتمام بالتفاصيل الصغيرة هو ما يميزهم عن غيرهم.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    date: '02 أغسطس 2024',
  },
];

async function setupDatabase() {
  if (!connectionString) {
    console.error('❌ خطأ: DATABASE_URL غير موجود في متغيرات البيئة');
    console.error('يرجى إضافة DATABASE_URL في ملف .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
  });

  try {
    console.log('🔌 جاري الاتصال بقاعدة البيانات...');
    await client.connect();
    console.log('✅ تم الاتصال بنجاح!');

    // قراءة سكريبت SQL
    const sqlScript = readFileSync(join(__dirname, '../supabase-migration.sql'), 'utf8');
    
    // تنفيذ السكريبت
    console.log('📝 جاري إنشاء الجداول...');
    await client.query(sqlScript);
    console.log('✅ تم إنشاء الجداول بنجاح!');

    // إدراج بيانات الموقع
    console.log('📊 جاري إدراج بيانات الموقع...');
    const siteDataId = '00000000-0000-0000-0000-000000000001';
    await client.query(
      `INSERT INTO site_data (id, data) 
       VALUES ($1, $2::jsonb)
       ON CONFLICT (id) DO UPDATE SET data = $2::jsonb, updated_at = NOW()`,
      [siteDataId, JSON.stringify(defaultSiteData)]
    );
    console.log('✅ تم إدراج بيانات الموقع بنجاح!');

    // التحقق من وجود مقالات قبل الإدراج
    const existingArticles = await client.query('SELECT COUNT(*) FROM articles');
    if (existingArticles.rows[0].count === '0') {
      // إدراج المقالات
      console.log('📰 جاري إدراج المقالات...');
      for (let i = 0; i < defaultArticles.length; i++) {
        const article = defaultArticles[i];
        await client.query(
          `INSERT INTO articles (title, excerpt, content, date, category, image, display_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            article.title,
            article.excerpt,
            article.content,
            article.date,
            article.category,
            article.image,
            i,
          ]
        );
      }
      console.log(`✅ تم إدراج ${defaultArticles.length} مقال بنجاح!`);
    } else {
      console.log(`ℹ️  يوجد بالفعل ${existingArticles.rows[0].count} مقال في قاعدة البيانات`);
    }

    // التحقق من وجود آراء العملاء قبل الإدراج
    const existingTestimonials = await client.query('SELECT COUNT(*) FROM testimonials');
    if (existingTestimonials.rows[0].count === '0') {
      // إدراج آراء العملاء
      console.log('⭐ جاري إدراج آراء العملاء...');
      for (let i = 0; i < defaultTestimonials.length; i++) {
        const testimonial = defaultTestimonials[i];
        await client.query(
          `INSERT INTO testimonials (name, role, content, image, date, display_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            testimonial.name,
            testimonial.role,
            testimonial.content,
            testimonial.image,
            testimonial.date,
            i,
          ]
        );
      }
      console.log(`✅ تم إدراج ${defaultTestimonials.length} رأي عميل بنجاح!`);
    } else {
      console.log(`ℹ️  يوجد بالفعل ${existingTestimonials.rows[0].count} رأي عميل في قاعدة البيانات`);
    }

    console.log('\n🎉 تم إعداد قاعدة البيانات بنجاح!');
    console.log('\n📋 ملخص:');
    console.log('  - تم إنشاء جميع الجداول');
    console.log('  - تم إدراج بيانات الموقع الافتراضية');
    console.log(`  - تم إدراج ${defaultArticles.length} مقال`);
    console.log(`  - تم إدراج ${defaultTestimonials.length} رأي عميل`);
    console.log('\n🔑 بيانات الدخول الافتراضية:');
    console.log('  - اسم المستخدم: admin');
    console.log('  - كلمة المرور: admin123');

  } catch (error) {
    console.error('❌ حدث خطأ:', error.message);
    if (error.detail) {
      console.error('التفاصيل:', error.detail);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
  }
}

// تشغيل السكريبت
setupDatabase();

