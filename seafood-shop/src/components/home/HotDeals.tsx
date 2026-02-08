import Link from 'next/link';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';
import ProductGrid from '@/components/product/ProductGrid';

// Không cache - luôn lấy data mới nhất
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHotDealsData() {
  try {
    await dbConnect();
    const products = await Product.find({ isHotDeal: true })
      .populate('category', 'name slug')
      .sort({ discountPercent: -1 })
      .lean();
    
    // Convert MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching hot deals:', error);
    return [];
  }
}

export default async function HotDeals() {
  const products = await getHotDealsData();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-12 bg-cream">
      <div className="container mx-auto px-3 md:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">
            🏷️ Khuyến Mãi Hot
          </h2>
          <Link
            href="/khuyen-mai"
            className="text-secondary hover:text-secondary-dark font-medium text-xs md:text-base"
          >
            Xem thêm →
          </Link>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          isLoading={false}
          emptyMessage="Chưa có sản phẩm khuyến mãi"
        />
      </div>
    </section>
  );
}
