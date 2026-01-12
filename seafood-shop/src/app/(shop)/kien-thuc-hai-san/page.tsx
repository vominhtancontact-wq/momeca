import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kiến thức hải sản - Mỡ Mê Cá',
  description: 'Chia sẻ kiến thức về hải sản, cách chọn hải sản tươi, cách chế biến và bảo quản hải sản',
};

const articles = [
  {
    id: 1,
    title: 'Cách chọn cua biển tươi ngon',
    excerpt: 'Hướng dẫn chi tiết cách nhận biết cua biển tươi sống, cách chọn cua chắc thịt và ngon nhất.',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=250&fit=crop',
    category: 'Mẹo chọn hải sản',
    date: '15/01/2025'
  },
  {
    id: 2,
    title: 'Bí quyết chế biến tôm hùm hoàn hảo',
    excerpt: 'Các cách chế biến tôm hùm ngon nhất: hấp, nướng, sốt bơ tỏi... giữ trọn hương vị tự nhiên.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=250&fit=crop',
    category: 'Công thức nấu ăn',
    date: '12/01/2025'
  },
  {
    id: 3,
    title: 'Cách bảo quản hải sản IQF đúng cách',
    excerpt: 'Hướng dẫn bảo quản hải sản trong tủ đông để giữ được độ tươi ngon lâu nhất.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
    category: 'Bảo quản',
    date: '10/01/2025'
  },
  {
    id: 4,
    title: 'Phân biệt các loại cá hồi trên thị trường',
    excerpt: 'Cá hồi Na Uy, cá hồi Chile, cá hồi Nhật... Đâu là loại phù hợp với bạn?',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=250&fit=crop',
    category: 'Kiến thức',
    date: '08/01/2025'
  },
  {
    id: 5,
    title: 'Lợi ích sức khỏe từ việc ăn hải sản',
    excerpt: 'Hải sản giàu Omega-3, protein và các khoáng chất thiết yếu cho cơ thể.',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=250&fit=crop',
    category: 'Sức khỏe',
    date: '05/01/2025'
  },
  {
    id: 6,
    title: 'Mùa nào ăn hải sản gì ngon nhất?',
    excerpt: 'Hướng dẫn chọn hải sản theo mùa để có được những món ăn ngon và giá tốt nhất.',
    image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=250&fit=crop',
    category: 'Kiến thức',
    date: '02/01/2025'
  }
];

const categories = [
  { name: 'Tất cả', count: 24 },
  { name: 'Mẹo chọn hải sản', count: 8 },
  { name: 'Công thức nấu ăn', count: 10 },
  { name: 'Bảo quản', count: 4 },
  { name: 'Sức khỏe', count: 2 },
];

export default function SeafoodKnowledgePage() {
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
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh mục</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <button className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors text-left">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Bạn cần tư vấn?</h4>
                <p className="text-sm text-gray-600 mb-3">Liên hệ hotline để được hỗ trợ</p>
                <a href="tel:1900xxxx" className="inline-flex items-center gap-2 text-primary font-bold">
                  <span>📞</span> 1900 xxxx
                </a>
              </div>
            </div>
          </aside>

          {/* Articles Grid */}
          <main className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <article key={article.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-400 mb-2">{article.date}</p>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                    <Link 
                      href={`/kien-thuc-hai-san/${article.id}`}
                      className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                    >
                      Đọc thêm
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-10">
              <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors">
                Xem thêm bài viết
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
