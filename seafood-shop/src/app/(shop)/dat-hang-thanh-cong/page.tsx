'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('orderNumber');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      router.push('/');
      return;
    }

    // Fetch order details
    fetch(`/api/orders?orderNumber=${orderNumber}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const orderData = data.data[0];
          
          // Nếu thanh toán online nhưng chưa thanh toán, chuyển về trang chờ
          if (orderData.paymentMethod === 'online' && orderData.paymentStatus !== 'paid') {
            router.push(`/cho-thanh-toan?orderNumber=${orderNumber}`);
            return;
          }
          
          setOrder(orderData);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching order:', error);
        setLoading(false);
      });
  }, [orderNumber, router]);

  // Generate VietQR URL
  const generateQRUrl = () => {
    if (!order) return '';
    
    const bankId = 'TPB'; // TPBank
    const accountNo = '29981722000';
    const accountName = 'VO THI THUY TIEN';
    const amount = order.totalAmount;
    const description = `${order.orderNumber} ${order.customerPhone}`;
    const template = 'compact'; // or 'compact2', 'qr_only'
    
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h1>
          <p className="text-gray-600 mb-6">Vui lòng kiểm tra lại mã đơn hàng</p>
          <Link href="/" className="text-primary hover:underline">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const isOnlinePayment = order.paymentMethod === 'online';
  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isOnlinePayment && isPaid ? 'Thanh toán thành công!' : 'Đặt hàng thành công!'}
          </h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
          </p>
          <p className="text-2xl font-bold text-primary mt-2">{order.orderNumber}</p>
        </div>

        {/* Payment Success Badge */}
        {isOnlinePayment && isPaid && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Đã nhận thanh toán</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Chúng tôi đã xác nhận thanh toán của bạn
            </p>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Người nhận:</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số điện thoại:</span>
              <span className="font-medium">{order.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Địa chỉ:</span>
              <span className="font-medium text-right max-w-xs">{order.customerAddress}</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-medium">
                {isOnlinePayment ? 'Chuyển khoản ngân hàng' : 'Thanh toán khi nhận hàng'}
              </span>
            </div>
            {isOnlinePayment && (
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái thanh toán:</span>
                <span className="font-medium text-green-600">Đã thanh toán</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-bold text-lg text-primary">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Bước tiếp theo:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {isOnlinePayment ? (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Chúng tôi đã xác nhận thanh toán của bạn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Đơn hàng đang được chuẩn bị</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Đơn hàng sẽ được giao trong vòng 2-4 giờ (nội thành)</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Đơn hàng sẽ được giao trong vòng 2-4 giờ (nội thành)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Thanh toán bằng tiền mặt khi nhận hàng</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium text-center hover:bg-primary-dark transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            href="/tai-khoan/don-hang"
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium text-center hover:bg-gray-50 transition-colors"
          >
            Xem đơn hàng của tôi
          </Link>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Cần hỗ trợ? Liên hệ hotline: <a href="tel:0899630279" className="text-primary font-semibold">0899 630 279</a></p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
