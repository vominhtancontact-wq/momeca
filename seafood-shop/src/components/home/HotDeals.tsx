import Link from 'next/link';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';
import ProductGrid from '@/components/product/ProductGrid';

async function getHotDealsData(limit = 15) {
  try {
    await dbConnect();
    const products = await Product.find({ isHotDeal: true })
      .populate('category', 'name slug')
      .sort({ discountPercent: -1 })
      .limit(limit)
      .lean();
    
    // Convert MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching hot deals:', error);
    return [];
  }
}

export default async function HotDeals() {
  const products = await getHotDealsData(15);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            🏷️ Khuyến Mãi Hot
          </h2>
          <Link
            href="/khuyen-mai"
            className="text-secondary hover:text-secondary-dark font-medium text-sm md:text-base"
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
