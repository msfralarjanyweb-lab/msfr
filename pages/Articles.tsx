import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Newspaper } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Articles: React.FC = () => {
  const { articles } = useData();

  return (
    <div className="min-h-screen bg-light pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 mb-6">
            <Newspaper className="text-primary" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">جميع المقالات</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اطلع على أحدث المقالات والأخبار القانونية والتحديثات المهمة
          </p>
        </div>

        {/* Articles Grid */}
        {articles && articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => {
              const articleIndex = articles.findIndex(a => a.title === article.title);
              return (
                <Link
                  key={index}
                  to={`/article/${articleIndex}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-r-4 border-accent"
                >
                  {/* Article Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/service.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">
                      {article.category}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{article.date}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-secondary mb-3 group-hover:text-accent transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 text-base leading-relaxed line-clamp-3 font-medium mb-4">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-accent font-bold text-sm group-hover:gap-4 transition-all">
                      <span>اقرأ المزيد</span>
                      <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-secondary mb-2">لا توجد مقالات متاحة</h3>
            <p className="text-gray-600 mb-6">لم يتم إضافة أي مقالات بعد.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors"
            >
              <ArrowLeft size={20} />
              <span>العودة إلى الصفحة الرئيسية</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
