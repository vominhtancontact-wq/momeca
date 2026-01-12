'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_FEE = 40000;

export default function OrderSummary() {
  const { items, getTotalAmount, appliedCoupon, setCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = getTotalAmount();
  const couponDiscount = appliedCoupon?.discount || 0;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsApplying(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderTotal: subtotal }),
      });

      const data = await res.json();

      if (data.success) {
        setCoupon({
          code: data.data.code,
          discount: data.data.discount,
        });
        setCouponCode('');
      } else {
        setCouponError(data.error || 'Mã giảm giá không hợp lệ');
      }
    } catch {
      setCouponError('Có lỗi xảy ra');
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Đơn hàng của bạn ({items.length} sản phẩm)
      </h2>

      {/* Free shipping progress */}
      {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-sm text-amber-700">
            Mua thêm <span className="font-semibold">{formatPrice(amountToFreeShipping)}</span> để được <span className="font-semibold text-green-600">miễn phí ship</span>
          </p>
          <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {items.map((item, index) => {
          const price = item.variant?.price ?? item.product.price;
          return (
            <div
              key={`${item.product._id}-${item.variant?._id || index}`}
              className="flex gap-3"
            >
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product.images && item.product.images.length > 0 ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    🦐
                  </div>
                )}
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {item.product.name}
                </p>
                {item.variant && (
                  <p className="text-xs text-gray-500">{item.variant.name}</p>
                )}
                <p className="text-sm font-semibold text-primary mt-1">
                  {formatPrice(price * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon Input */}
      <div className="border-t mt-4 pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Mã giảm giá</p>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-mono font-medium text-green-700">{appliedCoupon.code}</span>
              <span className="text-green-600 text-sm">(-{formatPrice(appliedCoupon.discount)})</span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
              placeholder="Nhập mã giảm giá"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={applyCoupon}
              disabled={isApplying}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isApplying ? '...' : 'Áp dụng'}
            </button>
          </div>
        )}
        {couponError && (
          <p className="mt-2 text-sm text-red-500">{couponError}</p>
        )}
      </div>

      {/* Totals */}
      <div className="border-t mt-4 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá:</span>
            <span>-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển:</span>
          {shippingFee === 0 ? (
            <span className="text-success font-medium">Miễn phí</span>
          ) : (
            <span>{formatPrice(shippingFee)}</span>
          )}
        </div>
        {shippingFee === 0 && subtotal >= FREE_SHIPPING_THRESHOLD && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Bạn được miễn phí vận chuyển!</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold pt-2 border-t">
          <span>Tổng cộng:</span>
          <span className="text-error">{formatPrice(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
