'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { formatPrice, formatNumber } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const hasVariants = product.variants && product.variants.length > 1;
  
  // Kiểm tra ảnh hợp lệ (không rỗng và có URL)
  const validImage = product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;

    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // Thêm vào giỏ hàng (variant đầu tiên nếu có)
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    addItem(product, variant, 1);

    // Show notification
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    router.push(`/dang-nhap?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <>
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
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </button>
          </div>
        )}
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up z-50">
          ✓ Đã thêm vào giỏ hàng
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Vui lòng đăng nhập
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Để sau
                </button>
                <button
                  onClick={handleLogin}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
