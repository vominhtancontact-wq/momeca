import { Product } from '@/types';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  showAddToCart?: boolean;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  isLoading = false,
  showAddToCart = false,
  emptyMessage = 'Không có sản phẩm nào'
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-4 text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  );
}
