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
    addItem(product, variant, undefined, 1);

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
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100/50 hover:border-primary/20 card-hover">
        <Link href={`/san-pham/${product.slug}`} className="block">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {validImage ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {hasDiscount && (
                <Badge variant="discount" className="animate-pulse-soft shadow-lg">-{product.discountPercent}%</Badge>
              )}
              {hasVariants && (
                <Badge variant="variant" className="shadow-md">Có {product.variants!.length} lựa chọn</Badge>
              )}
            </div>

            {/* Quick View Button - appears on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-primary font-medium rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-sm">
                Xem chi tiết
              </span>
            </div>

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <Badge variant="outOfStock" className="text-sm px-5 py-2.5 shadow-xl">
                  Hết hàng
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Product Name */}
            <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[48px] text-sm md:text-base group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2 flex-wrap">
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through decoration-gray-300">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Unit */}
            {product.unit && (
              <span className="text-xs text-gray-500 font-medium">/ {product.unit}</span>
            )}

            {/* Favorites & Rating */}
            <div className="mt-2 flex items-center justify-between">
              {product.soldCount > 0 ? (
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-red-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="font-medium">{formatNumber(product.soldCount)}</span>
                </p>
              ) : (
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-red-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="font-medium">Mới</span>
                </p>
              )}
              {/* Star Rating Visual */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </Link>

        {/* Add to Cart Button (optional) */}
        {showAddToCart && product.inStock && (
          <div className="px-4 pb-4">
            <button
              className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 btn-shine active:scale-[0.98]"
              onClick={handleAddToCart}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Thêm vào giỏ
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-green-500/30 animate-slide-up z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Đã thêm vào giỏ hàng
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Vui lòng đăng nhập
              </h3>
              <p className="text-gray-500 mb-8">
                Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  Để sau
                </button>
                <button
                  onClick={handleLogin}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 btn-shine"
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
