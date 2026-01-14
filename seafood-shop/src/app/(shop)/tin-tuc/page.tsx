import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';

export const metadata: Metadata = {
  title: 'Tin tức - Mỡ Mê Cá',
  description: 'Tin tức, kiến thức về hải sản, công thức nấu ăn và mẹo hay',
};

export const dynamic = 'force-dynamic';

const categoryLabels: Record<string, string> = {
  'kien-thuc': 'Kiến thức',
  'cong-thuc': 'Công thức',
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

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2 text-gray-500">
          <li><Link href="/" className="hover:text-primary">Trang chủ</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Tin tức</li>
        </ol>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Tin tức & Kiến thức
      </h1>

      {articles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Chưa có bài viết nào
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <Link
              key={article._id}
              href={`/tin-tuc/${article.slug}`}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video bg-gray-100">
                {article.thumbnail ? (
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-primary text-white text-xs rounded">
                    {categoryLabels[article.category] || article.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span>{article.viewCount} lượt xem</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
