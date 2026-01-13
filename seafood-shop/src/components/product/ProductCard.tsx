'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, formatNumber } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const hasVariants = product.variants && product.variants.length > 1;
  
  // Kiểm tra ảnh hợp lệ (không rỗng và có URL)
  const validImage = product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '';

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link href={`/san-pham/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {validImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="discount">-{product.discountPercent}%</Badge>
            )}
            {hasVariants && (
              <Badge variant="variant">Có {product.variants!.length} lựa chọn</Badge>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="outOfStock" className="text-sm px-4 py-2">
                Hết hàng
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[48px] text-sm md:text-base">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-error">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Unit */}
          {product.unit && (
            <span className="text-xs text-gray-500">/ {product.unit}</span>
          )}

          {/* Favorites */}
          <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {formatNumber(product.soldCount)} yêu thích
          </p>
        </div>
      </Link>

      {/* Add to Cart Button (optional) */}
      {showAddToCart && product.inStock && (
        <div className="px-3 pb-3">
          <button
            className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic will be handled by cart store
            }}
          >
            Thêm vào giỏ
          </button>
        </div>
      )}
    </div>
  );
}
