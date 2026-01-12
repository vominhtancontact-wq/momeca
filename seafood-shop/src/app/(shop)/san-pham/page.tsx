'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import { getProducts } from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular';

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'popular', label: 'Bán chạy' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get('page') || '1');
  const sort = (searchParams.get('sort') as SortOption) || 'newest';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProducts({
        page,
        limit: 12,
        sort,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      });

      if (response.success) {
        setProducts(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, sort, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`/san-pham?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams('sort', e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams('page', newPage.toString());
  };

  return (
    <>
      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
        {/* Price Filter */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Lọc giá:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Từ"
              defaultValue={minPrice || ''}
              onBlur={(e) => updateSearchParams('minPrice', e.target.value)}
              className="w-24 px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Đến"
              defaultValue={maxPrice || ''}
              onBlur={(e) => updateSearchParams('maxPrice', e.target.value)}
              className="w-24 px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sắp xếp:</span>
          <select
            value={sort}
            onChange={handleSortChange}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        emptyMessage="Không có sản phẩm nào"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-4">
          <Skeleton className="aspect-square mb-4" />
          <Skeleton className="h-4 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2 text-gray-500">
          <li>
            <a href="/" className="hover:text-primary">Trang chủ</a>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Tất cả sản phẩm</li>
        </ol>
      </nav>

      {/* Page Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Tất cả sản phẩm
      </h1>

      <Suspense fallback={<ProductsLoading />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
