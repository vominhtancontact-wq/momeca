import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Product } from '@/models';
import DeleteProductButton from './DeleteProductButton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getProducts() {
  await dbConnect();
  const products = await Product.find().populate('category').sort({ createdAt: -1 }).lean();
  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Link
          href="/admin/san-pham/them-moi"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Hình ảnh</th>
                  <th className="text-left py-3 px-4">Tên sản phẩm</th>
                  <th className="text-left py-3 px-4">Danh mục</th>
                  <th className="text-left py-3 px-4">Giá</th>
                  <th className="text-left py-3 px-4">Tồn kho</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🦐
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.slug}</p>
                    </td>
                    <td className="py-3 px-4">
                      {product.category?.name || 'Chưa phân loại'}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </p>
                      {product.originalPrice > product.price && (
                        <p className="text-sm text-gray-400 line-through">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">{product.stock}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.isActive ? 'Đang bán' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/san-pham/${product._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Sửa
                        </Link>
                        <DeleteProductButton productId={product._id.toString()} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
