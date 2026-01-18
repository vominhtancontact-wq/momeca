import Link from 'next/link';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';
import ProductGrid from '@/components/product/ProductGrid';

// Không cache - luôn lấy data mới nhất
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getBestSellersData() {
  try {
    await dbConnect();
    const products = await Product.find({ isBestSeller: true })
      .populate('category', 'name slug')
      .sort({ soldCount: -1 })
      .lean();
    
    // Convert MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}

export default async function BestSellers() {
  const products = await getBestSellersData();

  return (
    <section className="py-8 md:py-12 bg-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            🔥 Hải Sản Bán Chạy
          </h2>
          <Link
            href="/san-pham?sort=popular"
            className="text-primary hover:text-primary-dark font-medium text-sm md:text-base"
          >
            Xem thêm →
          </Link>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          isLoading={false}
          emptyMessage="Chưa có sản phẩm bán chạy"
        />
      </div>
    </section>
  );
}
