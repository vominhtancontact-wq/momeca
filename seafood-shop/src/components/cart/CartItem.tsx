'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import QuantitySelector from '@/components/product/QuantitySelector';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, variant, quantity } = item;

  const price = variant?.price ?? product.price;
  const subtotal = price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product._id, variant?._id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(product._id, variant?._id);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      {/* Image */}
      <Link href={`/san-pham/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              🦐
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/san-pham/${product.slug}`}
          className="font-medium text-gray-900 hover:text-primary line-clamp-2"
        >
          {product.name}
        </Link>

        {variant && (
          <p className="text-sm text-gray-500 mt-1">
            Loại: {variant.name}
          </p>
        )}

        <p className="text-primary font-semibold mt-1">
          {formatPrice(price)}
        </p>

        {/* Mobile: Quantity & Remove */}
        <div className="flex items-center justify-between mt-3 md:hidden">
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            size="sm"
          />
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-error transition-colors"
            aria-label="Xóa sản phẩm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop: Quantity */}
      <div className="hidden md:flex items-center">
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          size="md"
        />
      </div>

      {/* Desktop: Subtotal */}
      <div className="hidden md:flex items-center w-32 justify-end">
        <span className="font-semibold text-gray-900">
          {formatPrice(subtotal)}
        </span>
      </div>

      {/* Desktop: Remove */}
      <div className="hidden md:flex items-center">
        <button
          onClick={handleRemove}
          className="p-2 text-gray-400 hover:text-error transition-colors"
          aria-label="Xóa sản phẩm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
