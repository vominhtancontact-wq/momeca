'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { searchProducts } from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import SearchBar from '@/components/search/SearchBar';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setTotal(0);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchProducts(query, page, 12);
        if (response.success) {
          setProducts(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotal(response.pagination.total);
        }
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    window.history.pushState({}, '', `/tim-kiem?${params.toString()}`);
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar placeholder="Tìm kiếm hải sản..." />
      </div>

      {/* Results Header */}
      {query && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Kết quả tìm kiếm cho &quot;{query}&quot;
          </h1>
          {!isLoading && (
            <p className="text-gray-500 mt-1">
              Tìm thấy {total} sản phẩm
            </p>
          )}
        </div>
      )}

      {/* No Query */}
      {!query && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">
            Tìm kiếm sản phẩm
          </h2>
          <p className="mt-2 text-gray-500">
            Nhập từ khóa để tìm kiếm hải sản bạn cần
          </p>
        </div>
      )}

      {/* Results */}
      {query && (
        <>
          <ProductGrid
            products={products}
            isLoading={isLoading}
            emptyMessage="Không tìm thấy sản phẩm phù hợp"
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
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  );
}
