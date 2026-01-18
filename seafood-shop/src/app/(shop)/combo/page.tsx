import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';
import ProductGrid from '@/components/product/ProductGrid';

export const metadata: Metadata = {
  title: 'Combo Tiết Kiệm - Mỡ Mê Cá',
  description: 'Các combo hải sản tiết kiệm, giá tốt nhất. Mua combo tiết kiệm đến 20%.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getComboProducts() {
  try {
    await dbConnect();
    const products = await Product.find({ isCombo: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching combo products:', error);
    return [];
  }
}

export default async function ComboPage() {
  const products = await getComboProducts();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2 text-gray-500">
          <li>
            <a href="/" className="hover:text-primary">Trang chủ</a>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Combo Tiết Kiệm</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          🎁 Combo Tiết Kiệm
        </h1>
        <p className="text-gray-600">
          Các combo hải sản được chọn lọc kỹ càng, tiết kiệm đến 20%. Chất lượng đảm bảo, giá tốt nhất.
        </p>
      </div>

      {/* Products */}
      <ProductGrid
        products={products}
        isLoading={false}
        emptyMessage="Chưa có combo nào. Vui lòng quay lại sau!"
      />
    </div>
  );
}
