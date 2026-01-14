import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';

export const metadata: Metadata = {
  title: 'Kiến thức hải sản - Mỡ Mê Cá',
  description: 'Chia sẻ kiến thức về hải sản, cách chọn hải sản tươi, cách chế biến và bảo quản hải sản',
};

export const dynamic = 'force-dynamic';

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
      .limit(20)
      .lean();
    return JSON.parse(JSON.stringify(articles));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

async function getArticleStats() {
  try {
    await dbConnect();
    const stats = await Article.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const total = stats.reduce((sum, s) => sum + s.count, 0);
    return { stats, total };
  } catch (error) {
    return { stats: [], total: 0 };
  }
}

export default async function SeafoodKnowledgePage() {
  const [articles, { stats, total }] = await Promise.all([
    getArticles(),
    getArticleStats()
  ]);

  // Bài viết nổi bật (bài đầu tiên)
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kiến Thức Hải Sản</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Chia sẻ kinh nghiệm chọn, chế biến và bảo quản hải sản tươi ngon
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh mục</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/kien-thuc-hai-san"
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                  >
                    <span>Tất cả</span>
                    <span className="text-sm bg-primary text-white px-2 py-0.5 rounded-full">{total}</span>
                  </Link>
                </li>
                {Object.entries(categoryLabels).map(([key, label]) => {
                  const stat = stats.find((s: any) => s._id === key);
                  const count = stat?.count || 0;
                  return (
                    <li key={key}>
                      <Link 
                        href={`/tin-tuc?category=${key}`}
                        className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <span className="text-gray-700">{label}</span>
                        <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Bạn cần tư vấn?</h4>
                <p className="text-sm text-gray-600 mb-3">Liên hệ hotline để được hỗ trợ</p>
                <a href="tel:0899630279" className="inline-flex items-center gap-2 text-primary font-bold">
                  <span>📞</span> 0899 630 279
                </a>
              </div>
            </div>
          </aside>

          {/* Articles */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            {articles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Chưa có bài viết nào
              </div>
            ) : (
              <>
                {/* Featured Article */}
                {featuredArticle && (
                  <Link 
                    href={`/tin-tuc/${featuredArticle.slug}`}
                    className="block bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow mb-8"
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative h-64 md:h-full min-h-[250px] overflow-hidden">
                        {featuredArticle.thumbnail ? (
                          <Image
                            src={featuredArticle.thumbnail}
                            alt={featuredArticle.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                        <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                          {categoryLabels[featuredArticle.category] || featuredArticle.category}
                        </span>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <p className="text-sm text-gray-400 mb-2">
                          {new Date(featuredArticle.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">{featuredArticle.excerpt}</p>
                        <span className="inline-flex items-center gap-2 text-primary font-medium">
                          Đọc thêm
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Other Articles Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {otherArticles.map((article: any) => (
                    <Link 
                      key={article._id}
                      href={`/tin-tuc/${article.slug}`}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {article.thumbnail ? (
                          <Image
                            src={article.thumbnail}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                        <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                          {categoryLabels[article.category] || article.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-gray-400 mb-2">
                          {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                        <span className="inline-flex items-center gap-2 text-primary font-medium">
                          Đọc thêm
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All */}
                <div className="text-center mt-10">
                  <Link 
                    href="/tin-tuc"
                    className="inline-block px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors"
                  >
                    Xem tất cả bài viết
                  </Link>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
