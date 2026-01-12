'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { getProductsByCategory } from '@/lib/api';
import ProductGrid from './ProductGrid';

interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: string;
}

export default function RelatedProducts({ categorySlug, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await getProductsByCategory(categorySlug, { limit: 5 });
        if (response.success) {
          // Filter out current product
          const filtered = response.data.filter(p => p._id !== currentProductId);
          setProducts(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySlug) {
      fetchRelatedProducts();
    }
  }, [categorySlug, currentProductId]);

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        Sản phẩm liên quan
      </h2>
      <ProductGrid
        products={products}
        isLoading={isLoading}
      />
    </section>
  );
}
