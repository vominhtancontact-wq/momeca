'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/types';
import { formatPrice, formatNumber } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import QuantitySelector from './QuantitySelector';
import VariantSelector from './VariantSelector';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const currentPrice = selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const isInStock = selectedVariant?.inStock ?? product.inStock;

  const handleAddToCart = () => {
    if (!isInStock) return;

    setIsAdding(true);
    addItem(product, selectedVariant, quantity);

    // Show notification
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setIsAdding(false);
    }, 2000);
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
        {hasDiscount && originalPrice && (
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
