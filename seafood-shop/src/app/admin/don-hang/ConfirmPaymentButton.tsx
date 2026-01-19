'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ConfirmPaymentButtonProps {
  orderId: string;
  paymentStatus: string;
}

export default function ConfirmPaymentButton({ orderId, paymentStatus }: ConfirmPaymentButtonProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const handleConfirm = async () => {
    if (!confirm('Xác nhận đã nhận được thanh toán?')) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ paymentStatus: 'paid' }),
      });

      if (response.ok) {
        alert('Đã xác nhận thanh toán thành công!');
        router.refresh();
      } else {
        alert('Có lỗi xảy ra khi xác nhận thanh toán');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Có lỗi xảy ra khi xác nhận thanh toán');
    } finally {
      setUpdating(false);
    }
  };

  if (paymentStatus === 'paid') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">Đã xác nhận thanh toán</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={updating}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {updating ? (
        <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Xác nhận đã nhận thanh toán
        </>
      )}
    </button>
  );
}
