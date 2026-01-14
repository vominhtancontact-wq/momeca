import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  try {
    await dbConnect();
    const article = await Article.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();
    return article ? JSON.parse(JSON.stringify(article)) : null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function getRelatedArticles(category: string, currentSlug: string) {
  try {
    await dbConnect();
    const articles = await Article.find({ 
      category, 
      isPublished: true,
      slug: { $ne: currentSlug }
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return JSON.parse(JSON.stringify(articles));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    return { title: 'Không tìm thấy bài viết' };
  }

  return {
    title: `${article.title} - Mỡ Mê Cá`,
    description: article.excerpt,
  };
}

const categoryLabels: Record<string, string> = {
  'kien-thuc': 'Kiến thức hải sản',
  'cong-thuc': 'Công thức nấu ăn',
  'tin-tuc': 'Tin tức',
  'meo-hay': 'Mẹo hay',
};

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, slug);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2 text-gray-500">
          <li><Link href="/" className="hover:text-primary">Trang chủ</Link></li>
          <li>/</li>
          <li><Link href="/tin-tuc" className="hover:text-primary">Tin tức</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium line-clamp-1">{article.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Thumbnail */}
            {article.thumbnail && (
              <div className="relative aspect-video">
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Category & Date */}
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {categoryLabels[article.category] || article.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              {/* Author & Views */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <span className="text-sm text-gray-600">
                  Tác giả: <strong>{article.author}</strong>
                </span>
                <span className="text-sm text-gray-500">
                  {article.viewCount} lượt xem
                </span>
              </div>

              {/* Excerpt */}
              <p className="text-lg text-gray-600 mb-6 italic">
                {article.excerpt}
              </p>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-lg prose-img:shadow-md
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>

          {/* Share */}
          <div className="mt-6 p-4 bg-white rounded-xl shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Chia sẻ bài viết:</p>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://momeca.vn/tin-tuc/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://momeca.vn/tin-tuc/${slug}`)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600"
              >
                Twitter
              </a>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Bài viết liên quan</h3>
              <div className="space-y-4">
                {relatedArticles.map((related: any) => (
                  <Link
                    key={related._id}
                    href={`/tin-tuc/${related.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="relative w-20 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      {related.thumbnail ? (
                        <Image
                          src={related.thumbnail}
                          alt={related.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(related.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h3 className="font-bold text-gray-900 mb-4">Danh mục</h3>
            <div className="space-y-2">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Link
                  key={key}
                  href={`/tin-tuc?category=${key}`}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
