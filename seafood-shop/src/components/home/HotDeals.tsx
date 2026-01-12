'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { getHotDeals } from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';

export default function HotDeals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getHotDeals(15);
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching hot deals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!isLoading && products.length === 0) {
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
          isLoading={isLoading}
          emptyMessage="Chưa có sản phẩm khuyến mãi"
        />
      </div>
    </section>
  );
}
