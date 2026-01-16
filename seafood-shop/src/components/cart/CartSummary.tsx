'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_FEE = 40000;

export default function CartSummary() {
  // Subscribe trực tiếp vào items để component re-render khi items thay đổi
  const items = useCartStore((state) => state.items);
  
  // Tính toán trực tiếp từ items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => {
    const price = item.variant?.price ?? item.product.price;
    return total + price * item.quantity;
  }, 0);
  
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Tóm tắt đơn hàng
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

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Số lượng sản phẩm:</span>
          <span className="font-medium">{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển:</span>
          {shippingFee === 0 ? (
            <span className="font-medium text-success">Miễn phí</span>
          ) : (
            <span className="font-medium">{formatPrice(shippingFee)}</span>
          )}
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-base">
            <span className="font-semibold text-gray-900">Tổng cộng:</span>
            <span className="font-bold text-error text-lg">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      <Link href="/thanh-toan" className="block mt-6">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={totalItems === 0}
        >
          Tiến hành thanh toán
        </Button>
      </Link>

      <Link
        href="/san-pham"
        className="block text-center text-primary hover:text-primary-dark mt-4 text-sm"
      >
        ← Tiếp tục mua sắm
      </Link>
    </div>
  );
}
