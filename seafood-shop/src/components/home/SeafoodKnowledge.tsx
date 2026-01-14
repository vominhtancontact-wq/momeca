import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';

const categoryLabels: Record<string, string> = {
  'kien-thuc': 'Kiến thức',
  'cong-thuc': 'Công thức nấu ăn',
  'tin-tuc': 'Tin tức',
  'meo-hay': 'Mẹo hay',
};

async function getArticles() {
  try {
    await dbConnect();
    const articles = await Article.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(7)
      .lean();
    return JSON.parse(JSON.stringify(articles));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function SeafoodKnowledge() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return null;
  }

  const featuredArticle = articles[0];
  const sideArticles = articles.slice(1, 5);
  const rightArticles = articles.slice(5, 7);

  return (
    <section className="py-12 bg-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              <span className="text-primary">KIẾN THỨC</span> HẢI SẢN
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-12 h-1 bg-primary rounded-full"></span>
              <span className="w-3 h-3 bg-primary/30 rounded-full"></span>
            </div>
          </div>
          <Link 
            href="/kien-thuc-hai-san"
            className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Xem thêm
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Articles Grid - 3 columns layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Featured Article */}
          <div className="lg:col-span-1">
            {featuredArticle && (
              <Link href={`/tin-tuc/${featuredArticle.slug}`} className="group block">
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                  <div className="relative h-[280px] overflow-hidden bg-gray-100">
                    {featuredArticle.thumbnail ? (
                      <Image 
                        src={featuredArticle.thumbnail} 
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                      {categoryLabels[featuredArticle.category] || featuredArticle.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{featuredArticle.excerpt}</p>
                  </div>
                </article>
              </Link>
            )}
          </div>

          {/* Middle Column - 4 small articles */}
          <div className="lg:col-span-1 space-y-4">
            {sideArticles.map((article: any) => (
              <Link 
                key={article._id} 
                href={`/tin-tuc/${article.slug}`}
                className="group flex gap-4 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="w-28 h-24 flex-shrink-0 overflow-hidden relative bg-gray-100">
                  {article.thumbnail ? (
                    <Image 
                      src={article.thumbnail} 
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 py-2 pr-3">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Column - 2 medium articles */}
          <div className="lg:col-span-1 space-y-4">
            {rightArticles.map((article: any) => (
              <Link 
                key={article._id} 
                href={`/tin-tuc/${article.slug}`}
                className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-36 overflow-hidden bg-gray-100">
                  {article.thumbnail ? (
                    <Image 
                      src={article.thumbnail} 
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
