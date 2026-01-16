'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/types';
import { formatPrice, formatNumber } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import QuantitySelector from './QuantitySelector';
import VariantSelector from './VariantSelector';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const currentPrice = selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const isInStock = selectedVariant?.inStock ?? product.inStock;

  const handleAddToCart = () => {
    if (!isInStock) return;

    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setIsAdding(true);
    addItem(product, selectedVariant, quantity);

    // Show notification
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setIsAdding(false);
    }, 2000);
  };

  const handleLogin = () => {
    // Lưu URL hiện tại để redirect sau khi đăng nhập
    const currentPath = window.location.pathname;
    router.push(`/dang-nhap?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {formatNumber(product.soldCount)} yêu thích
          </span>
          {product.unit && <span>Đơn vị: {product.unit}</span>}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-error">
          {formatPrice(currentPrice)}
        </span>
        {hasDiscount && originalPrice && originalPrice > currentPrice && (
          <>
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
            <Badge variant="discount">-{product.discountPercent}%</Badge>
          </>
        )}
      </div>

      {/* Stock Status */}
      {!isInStock && (
        <Badge variant="outOfStock" className="text-base px-4 py-2">
          Hết hàng
        </Badge>
      )}

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onVariantSelect={setSelectedVariant}
        />
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Số lượng:
        </label>
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          min={1}
          max={99}
          size="lg"
        />
      </div>

      {/* Add to Cart Button */}
      <div className="flex gap-4">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!isInStock}
          isLoading={isAdding}
        >
          {isInStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
        </Button>
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

      {/* Description */}
      <div className="pt-6 border-t">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Mô tả sản phẩm
        </h2>
        <div className="prose prose-sm max-w-none text-gray-600">
          {product.description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag, index) => (
            <Badge key={index} variant="info">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
