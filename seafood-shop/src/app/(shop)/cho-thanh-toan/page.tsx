'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function PendingPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('orderNumber');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      router.push('/');
      return;
    }

    fetchOrder();
    
    // Auto check payment status every 10 seconds
    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [orderNumber, router]);

  const fetchOrder = () => {
    fetch(`/api/orders?orderNumber=${orderNumber}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const orderData = data.data[0];
          console.log('Order data:', orderData);
          setOrder(orderData);
          
          // Chỉ redirect nếu đã thanh toán (không redirect ngay khi vừa tạo đơn)
          // Kiểm tra thêm điều kiện: đơn đã tồn tại > 5 giây
          const orderAge = Date.now() - new Date(orderData.createdAt).getTime();
          if (orderData.paymentStatus === 'paid' && orderAge > 5000) {
            console.log('Order already paid, redirecting to success page');
            router.push(`/dat-hang-thanh-cong?orderNumber=${orderNumber}`);
          }
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching order:', error);
        setLoading(false);
      });
  };

  const checkPaymentStatus = () => {
    if (checking) return;
    
    setChecking(true);
    fetch(`/api/orders?orderNumber=${orderNumber}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const orderData = data.data[0];
          if (orderData.paymentStatus === 'paid') {
            router.push(`/dat-hang-thanh-cong?orderNumber=${orderNumber}`);
          }
        }
        setChecking(false);
      })
      .catch(error => {
        console.error('Error checking payment:', error);
        setChecking(false);
      });
  };

  // Generate VietQR URL
  const generateQRUrl = () => {
    if (!order) return '';
    
    const bankId = 'TPB';
    const accountNo = '29981722000';
    const accountName = 'VO THI THUY TIEN';
    const amount = order.totalAmount;
    const description = `${order.orderNumber} ${order.customerPhone}`;
    const template = 'compact';
    
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Pending Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chờ thanh toán</h1>
          <p className="text-gray-600">
            Vui lòng chuyển khoản để hoàn tất đơn hàng
          </p>
          <p className="text-2xl font-bold text-primary mt-2">{order.orderNumber}</p>
        </div>

        {/* QR Code Payment */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-6 border-2 border-blue-200">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Quét mã QR để thanh toán
            </h2>
            <p className="text-gray-600 text-sm">
              Vui lòng chuyển khoản <span className="font-bold text-primary">ĐÚNG SỐ TIỀN</span> và <span className="font-bold text-primary">ĐÚNG NỘI DUNG</span>
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            {/* Layout 2 cột: QR code bên trái, thông tin bên phải */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[280px] aspect-square bg-white rounded-lg overflow-hidden border-2 border-gray-100">
                  <Image
                    src={generateQRUrl()}
                    alt="QR Code thanh toán"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Quét mã QR bằng ứng dụng ngân hàng
                </p>
              </div>

              {/* Payment Info */}
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-gray-900 mb-4">Thông tin chuyển khoản:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-semibold">TPBank</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <span className="font-semibold font-mono">29981722000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-semibold">VO THI THUY TIEN</span>
                  </div>
                  <div className="flex justify-between py-3 border-b bg-yellow-50 -mx-3 px-3 rounded">
                    <span className="text-gray-600 font-semibold">Số tiền:</span>
                    <span className="font-bold text-lg text-red-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 bg-yellow-50 -mx-3 px-3 rounded">
                    <span className="text-gray-600 font-semibold">Nội dung:</span>
                    <span className="font-semibold text-right text-red-600">{order.orderNumber} {order.customerPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-sm font-bold text-red-800 text-center mb-2">
                ⚠️ LƯU Ý QUAN TRỌNG
              </p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Chuyển khoản ĐÚNG số tiền: <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ</span></li>
                <li>• Ghi ĐÚNG nội dung: <span className="font-bold">{order.orderNumber} {order.customerPhone}</span></li>
                <li>• Đơn hàng sẽ tự động xác nhận sau khi chúng tôi nhận được thanh toán</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Auto Check Status */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-700">
            <svg className={`w-5 h-5 ${checking ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium">
              {checking ? 'Đang kiểm tra thanh toán...' : 'Tự động kiểm tra thanh toán mỗi 10 giây'}
            </span>
          </div>
        </div>

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
              <span className="text-gray-600">Trạng thái thanh toán:</span>
              <span className="font-medium text-yellow-600">Chờ thanh toán</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={checkPaymentStatus}
            disabled={checking}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium text-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checking ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
          </button>
          <Link
            href="/"
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium text-center hover:bg-gray-50 transition-colors"
          >
            Về trang chủ
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

export default function PendingPaymentPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    }>
      <PendingPaymentContent />
    </Suspense>
  );
}
