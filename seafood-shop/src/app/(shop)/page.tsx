import { Metadata } from 'next';
import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import BestSellers from '@/components/home/BestSellers';
import ComboDeals from '@/components/home/ComboDeals';
import PromoBanner from '@/components/home/PromoBanner';
import HotDeals from '@/components/home/HotDeals';
import FlashSale from '@/components/home/FlashSale';
import SeafoodKnowledge from '@/components/home/SeafoodKnowledge';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Mỡ Mê Cá - Chuyên cung cấp hải sản tươi sống và IQF',
  description: 'Mua hải sản tươi sống, IQF chất lượng cao. Cua, tôm, cá, ốc, mực... Giao hàng nhanh, giá tốt nhất thị trường.',
  keywords: 'hải sản, hải sản tươi, hải sản IQF, cua, tôm, cá, ốc, mực, mỡ mê cá',
};

// Loading component cho sections
function SectionLoading({ title }: { title: string }) {
  return (
    <section className="py-8 md:py-12 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <ProductGridSkeleton count={5} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Category Sidebar + Banners */}
      <HeroSection />

      {/* Flash Sale Section */}
      <FlashSale />

      {/* Best Sellers Section */}
      <Suspense fallback={<SectionLoading title="🔥 Hải Sản Bán Chạy" />}>
        <BestSellers />
      </Suspense>

      {/* Combo Deals Section */}
      <Suspense fallback={<SectionLoading title="🎁 Combo Tiết Kiệm" />}>
        <ComboDeals />
      </Suspense>

      {/* Promo Banner Slider */}
      <PromoBanner />

      {/* Hot Deals Section */}
      <Suspense fallback={<SectionLoading title="🏷️ Khuyến Mãi Hot" />}>
        <HotDeals />
      </Suspense>

      {/* Seafood Knowledge Section */}
      <Suspense fallback={<SectionLoading title="📚 Kiến Thức Hải Sản" />}>
        <SeafoodKnowledge />
      </Suspense>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-cream to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-primary/10 text-primary text-xs md:text-sm font-semibold rounded-full mb-3 md:mb-4">
              Tại sao chọn chúng tôi?
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Cam Kết <span className="text-primary">Chất Lượng</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="group text-center p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
              <div className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 md:mb-5 bg-gradient-to-br from-primary to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-primary/30">
                <svg className="w-6 h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-lg">Cam kết tươi sống</h3>
              <p className="text-[10px] md:text-sm text-gray-500 leading-relaxed">100% hải sản tươi ngon, đảm bảo chất lượng</p>
            </div>

            <div className="group text-center p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
              <div className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 md:mb-5 bg-gradient-to-br from-secondary to-red-400 rounded-xl md:rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-secondary/30">
                <svg className="w-6 h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-lg">Giao hàng nhanh</h3>
              <p className="text-[10px] md:text-sm text-gray-500 leading-relaxed">Trong vòng 2-4 giờ nội thành</p>
            </div>

            <div className="group text-center p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
              <div className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 md:mb-5 bg-gradient-to-br from-accent to-orange-400 rounded-xl md:rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-accent/30">
                <svg className="w-6 h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-lg">Tư vấn tận tâm</h3>
              <p className="text-[10px] md:text-sm text-gray-500 leading-relaxed">Hỗ trợ chọn hải sản phù hợp</p>
            </div>

            <div className="group text-center p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
              <div className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 md:mb-5 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl md:rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-green-500/30">
                <svg className="w-6 h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-lg">Hỗ trợ 24/7</h3>
              <p className="text-[10px] md:text-sm text-gray-500 leading-relaxed">Hotline: 0899 630 279</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
