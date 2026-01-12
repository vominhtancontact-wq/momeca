'use client';

import Link from 'next/link';

// Sample articles data - same as in the knowledge page
const articles = [
  {
    id: 1,
    title: 'Ốc Gai Nấu Gì Ngon? Mách Bạn 07 Cách Chế Biến Ốc Gai Ăn Là Ghiền',
    excerpt: 'Nếu bạn chưa biết nên ốc gai nấu gì ngon sao cho vừa đơn giản, vừa nhanh gọn mà lại vừa ngon. Vẫn giữ được vị ngon tự nhiên của ốc gai...',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&h=400&fit=crop',
    category: 'Công thức nấu ăn',
    date: '15/01/2025',
    featured: true
  },
  {
    id: 2,
    title: 'Sò Tai Tượng Nấu Súp | Món Ăn Dinh Dưỡng Ngon Tuyệt Cho Cả Gia Đình',
    excerpt: 'Hướng dẫn cách nấu súp sò tai tượng thơm ngon, bổ dưỡng cho cả gia đình.',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=250&fit=crop',
    category: 'Công thức nấu ăn',
    date: '12/01/2025'
  },
  {
    id: 3,
    title: 'Tác Dụng Của Tôm Biển Là Gì? Bật Mí Điều Có Thể Bạn Chưa Biết',
    excerpt: 'Khám phá những lợi ích sức khỏe tuyệt vời từ tôm biển mà bạn nên biết.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=250&fit=crop',
    category: 'Sức khỏe',
    date: '10/01/2025'
  },
  {
    id: 4,
    title: 'Chi Tiết 5 Cách Làm Ốc Bươu Xào Thơm Ngon Độc Đáo Nhất',
    excerpt: 'Tổng hợp 5 cách chế biến ốc bươu xào ngon nhất, dễ làm tại nhà.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
    category: 'Công thức nấu ăn',
    date: '08/01/2025'
  },
  {
    id: 5,
    title: 'Cách Ăn Hàu Sống Béo, Ngậy, Không Tanh Và Những Điều Cần Chú Ý',
    excerpt: 'Bí quyết thưởng thức hàu sống đúng cách để có trải nghiệm tuyệt vời nhất.',
    image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=250&fit=crop',
    category: 'Mẹo hay',
    date: '05/01/2025'
  },
  {
    id: 6,
    title: 'TOP 03 Tư Hải Hấp Thơm Ngon Càng Ăn Càng Mê',
    excerpt: 'Khám phá 3 cách hấp tư hải thơm ngon, giữ trọn vị ngọt tự nhiên.',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=250&fit=crop',
    category: 'Công thức nấu ăn',
    date: '02/01/2025'
  },
  {
    id: 7,
    title: 'Chi Tiết Công Thức Vẹm Xanh Nướng Mỡ Hành Đơn Giản Tại Nhà',
    excerpt: 'Hướng dẫn chi tiết cách làm vẹm xanh nướng mỡ hành thơm lừng.',
    image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=400&h=250&fit=crop',
    category: 'Công thức nấu ăn',
    date: '01/01/2025'
  }
];

export default function SeafoodKnowledge() {
  const featuredArticle = articles.find(a => a.featured);
  const sideArticles = articles.filter(a => !a.featured).slice(0, 4);
  const rightArticles = articles.filter(a => !a.featured).slice(4, 6);

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
              <Link href={`/kien-thuc-hai-san/${featuredArticle.id}`} className="group block">
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                  <div className="relative h-[280px] overflow-hidden">
                    <img 
                      src={featuredArticle.image} 
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                      {featuredArticle.category}
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
            {sideArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/kien-thuc-hai-san/${article.id}`}
                className="group flex gap-4 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="w-28 h-24 flex-shrink-0 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 py-2 pr-3">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{article.date}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Column - 2 medium articles */}
          <div className="lg:col-span-1 space-y-4">
            {rightArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/kien-thuc-hai-san/${article.id}`}
                className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-36 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{article.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
