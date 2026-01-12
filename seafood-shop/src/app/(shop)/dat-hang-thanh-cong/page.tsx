'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Đặt hàng thành công!
        </h1>

        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
        </p>

        {orderNumber && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Mã đơn hàng của bạn:</p>
            <p className="text-xl font-bold text-primary">{orderNumber}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href={`/tra-cuu-don-hang?orderNumber=${orderNumber || ''}`}
            className="block w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors text-center"
          >
            Xem chi tiết đơn hàng
          </Link>
          <Link
            href="/"
            className="block w-full py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors text-center"
          >
            Về trang chủ
          </Link>
          <Link
            href="/san-pham"
            className="block w-full py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>Nếu có thắc mắc, vui lòng liên hệ:</p>
          <p className="font-semibold text-primary mt-1">Hotline: 1900 xxxx</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Đang tải...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
