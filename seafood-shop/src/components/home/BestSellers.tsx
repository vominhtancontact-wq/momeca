'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { getBestSellers } from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getBestSellers(15);
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
          isLoading={isLoading}
          emptyMessage="Chưa có sản phẩm bán chạy"
        />
      </div>
    </section>
  );
}
