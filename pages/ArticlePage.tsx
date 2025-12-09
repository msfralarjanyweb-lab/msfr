import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const ArticlePage: React.FC = () => {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const { articles } = useData();
  
  const articleIndex = index ? parseInt(index, 10) : -1;
  const article = articleIndex >= 0 && articleIndex < articles.length ? articles[articleIndex] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-light pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">المقال غير موجود</h2>
            <p className="text-gray-600 mb-6">عذراً، المقال المطلوب غير موجود أو تم حذفه.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors"
            >
              <ArrowLeft size={20} />
              <span>العودة إلى الصفحة الرئيسية</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get related articles (exclude current article)
  const relatedArticles = articles
    .filter((_, i) => i !== articleIndex)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-light pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>العودة</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Article Image */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/service.png';
                  }}
                />
                <div className="absolute top-6 right-6">
                  <span className="bg-accent text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-8 md:p-12">
                {/* Article Meta */}
                <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={18} />
                    <span>{article.category}</span>
                  </div>
                </div>

                {/* Article Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Article Excerpt */}
                {article.excerpt && (
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium border-r-4 border-primary pr-6 py-4 bg-primary/5">
                    {article.excerpt}
                  </p>
                )}

                {/* Article Full Content */}
                <div className="prose prose-lg max-w-none">
                  {article.content ? (
                    <div 
                      className="text-gray-700 leading-relaxed text-lg space-y-6"
                      dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
                    />
                  ) : (
                    <div className="text-gray-700 leading-relaxed text-lg space-y-6">
                      <p>{article.excerpt}</p>
                      <p>
                        هذا مقال قانوني مهم يتناول موضوعاً حيوياً في مجال القانون. نقدم لكم تحليلاً شاملاً 
                        ومفصلاً حول هذا الموضوع المهم.
                      </p>
                      <p>
                        في هذا القسم، نستكشف الجوانب المختلفة للموضوع ونقدم رؤى قانونية قيمة تساعد القراء 
                        على فهم التعقيدات القانونية المرتبطة بهذا الموضوع.
                      </p>
                      <h2 className="text-3xl font-bold text-secondary mt-8 mb-4">الخلاصة</h2>
                      <p>
                        نأمل أن يكون هذا المقال قد قدم لكم معلومات قيمة ومفيدة حول هذا الموضوع القانوني المهم.
                        إذا كان لديكم أي استفسارات، لا تترددوا في التواصل معنا.
                      </p>
                    </div>
                  )}
                </div>

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <Share2 size={20} className="text-gray-400" />
                    <span className="text-gray-600 font-medium">شارك هذا المقال:</span>
                    <div className="flex gap-3">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(article.title + ' - ' + window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                      >
                        <span className="text-lg">💬</span>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                      >
                        <span className="text-sm font-bold">X</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-2xl font-bold text-secondary mb-6">مقالات ذات صلة</h3>
                <div className="space-y-6">
                  {relatedArticles.map((relatedArticle, idx) => {
                    const relatedIndex = articles.findIndex(a => a.title === relatedArticle.title);
                    return (
                      <Link
                        key={idx}
                        to={`/article/${relatedIndex}`}
                        className="block group"
                      >
                        <div className="h-40 overflow-hidden rounded-lg mb-3">
                          <img
                            src={relatedArticle.image}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/service.png';
                            }}
                          />
                        </div>
                        <h4 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-gray-500">{relatedArticle.date}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Articles Link */}
            <Link
              to="/articles"
              className="block bg-primary text-white rounded-lg shadow-md p-6 text-center font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
            >
              <span>عرض جميع المقالات</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
