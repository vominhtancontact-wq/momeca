import { Metadata } from 'next';
import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import BestSellers from '@/components/home/BestSellers';
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

      {/* Promo Banner Slider */}
      <PromoBanner />

      {/* Hot Deals Section */}
      <Suspense fallback={<SectionLoading title="🏷️ Khuyến Mãi Hot" />}>
        <HotDeals />
      </Suspense>

      {/* Seafood Knowledge Section */}
      <SeafoodKnowledge />

      {/* Features Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cam kết tươi sống</h3>
              <p className="text-sm text-gray-500">100% hải sản tươi ngon</p>
            </div>

            <div className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Giao hàng nhanh</h3>
              <p className="text-sm text-gray-500">Trong vòng 2-4 giờ</p>
            </div>

            <div className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-yellow-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tư vấn tận tâm</h3>
              <p className="text-sm text-gray-500">Hỗ trợ chọn hải sản</p>
            </div>

            <div className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
              <p className="text-sm text-gray-500">Hotline: 0899 630 279</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
