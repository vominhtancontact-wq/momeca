import Link from 'next/link';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';
import ProductGrid from '@/components/product/ProductGrid';

// Không cache - luôn lấy data mới nhất
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getComboDealsData() {
  try {
    await dbConnect();
    const products = await Product.find({ isCombo: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .lean();
    
    // Convert MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching combo deals:', error);
    return [];
  }
}

export default async function ComboDeals() {
  const products = await getComboDealsData();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            🎁 Combo Tiết Kiệm
          </h2>
          <Link
            href="/combo"
            className="text-primary hover:text-primary-dark font-medium text-sm md:text-base"
          >
            Xem thêm →
          </Link>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          isLoading={false}
          emptyMessage="Chưa có combo nào"
        />
      </div>
    </section>
  );
}
