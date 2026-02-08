'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import DeleteProductButton from './DeleteProductButton';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  stock: number;
  isActive: boolean;
  images?: string[];
  category?: {
    name: string;
  };
}

interface ProductListClientProps {
  products: Product[];
}

export default function ProductListClient({ products }: ProductListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const slugMatch = product.slug.toLowerCase().includes(query);
      const categoryMatch = product.category?.name.toLowerCase().includes(query);
      
      return nameMatch || slugMatch || categoryMatch;
    });
  }, [products, searchQuery]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Quản lý sản phẩm</h1>
        <Link
          href="/admin/san-pham/them-moi"
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-center text-sm md:text-base"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên, slug hoặc danh mục..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {searchQuery && (
          <p className="mt-2 text-xs md:text-sm text-gray-600">
            Tìm thấy {filteredProducts.length} sản phẩm
          </p>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          {searchQuery ? 'Không tìm thấy sản phẩm nào phù hợp.' : 'Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!'}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="flex gap-3 p-3">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1.5">{product.category?.name || 'Chưa phân loại'}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Kho: {product.stock}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.isActive ? 'Đang bán' : 'Ẩn'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-gray-100">
                  <Link
                    href={`/admin/san-pham/${product._id}`}
                    className="flex-1 text-center py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                  >
                    Sửa
                  </Link>
                  <div className="flex-1 flex items-center justify-center border-l border-gray-100">
                    <DeleteProductButton productId={product._id.toString()} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hình ảnh</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tên sản phẩm</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Danh mục</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Giá</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tồn kho</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
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
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.slug}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
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
                      <td className="py-3 px-4 text-gray-700">{product.stock}</td>
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
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
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
          </div>
        </>
      )}
    </div>
  );
}
