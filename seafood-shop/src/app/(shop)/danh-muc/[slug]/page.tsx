'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { getProductsByCategory } from '@/lib/api';
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

function CategoryContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get('page') || '1');
  const sort = (searchParams.get('sort') as SortOption) || 'newest';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProductsByCategory(slug, {
        page,
        limit: 12,
        sort,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      });

      if (response.success) {
        setProducts(response.data);
        setCategory(response.category);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [slug, page, sort, minPrice, maxPrice]);

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
    router.push(`/danh-muc/${slug}?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams('sort', e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams('page', newPage.toString());
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {category?.name || 'Danh mục sản phẩm'}
        </h1>
        {category?.description && (
          <p className="mt-2 text-gray-600">{category.description}</p>
        )}
      </div>

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
        emptyMessage="Không có sản phẩm trong danh mục này"
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

function CategoryLoading() {
  return (
    <>
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <Skeleton className="aspect-square mb-4" />
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2 text-gray-500">
          <li>
            <a href="/" className="hover:text-primary">Trang chủ</a>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Danh mục</li>
        </ol>
      </nav>

      <Suspense fallback={<CategoryLoading />}>
        <CategoryContent slug={slug} />
      </Suspense>
    </div>
  );
}
