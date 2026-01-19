'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { createOrder } from '@/lib/api';
import { isValidPhone } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerNote: string;
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: 'cod' | 'online';
}

interface FormErrors {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  deliveryDate?: string;
}

const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
];

export default function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart, appliedCoupon } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    customerNote: '',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerPhone: user.phone || '',
        customerEmail: user.email || '',
        customerAddress: user.address || '',
      }));
    }
  }, [user]);

  // Get min date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get max date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Vui lòng nhập họ tên';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Vui lòng nhập số điện thoại';
    } else if (!isValidPhone(formData.customerPhone)) {
      newErrors.customerPhone = 'Số điện thoại không hợp lệ';
    }

    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email không hợp lệ';
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Vui lòng nhập địa chỉ giao hàng';
    } else if (formData.customerAddress.trim().length < 10) {
      newErrors.customerAddress = 'Địa chỉ quá ngắn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        variantId: item.variant?._id,
        quantity: item.quantity,
      }));

      const response = await createOrder({
        ...formData,
        items: orderItems,
        couponCode: appliedCoupon?.code,
      });

      if (response.success && response.data) {
        console.log('Order created successfully:', response.data);
        console.log('Payment method:', formData.paymentMethod);
        console.log('Order number:', response.data.orderNumber);
        
        // Phân luồng theo phương thức thanh toán
        if (formData.paymentMethod === 'online') {
          // Thanh toán online: chuyển đến trang chờ thanh toán với QR code
          console.log('Redirecting to payment page...');
          const orderNumber = response.data.orderNumber;
          
          // KHÔNG clear cart ở đây - để trang chờ thanh toán tự clear
          // Sử dụng window.location để force redirect
          window.location.href = `/cho-thanh-toan?orderNumber=${orderNumber}`;
        } else {
          // COD: chuyển đến trang tài khoản
          clearCart();
          alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
          router.push('/tai-khoan');
        }
      } else {
        console.error('Order creation failed:', response);
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-96" />;
  }

  // Require login to checkout
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Vui lòng đăng nhập để đặt hàng
        </h2>
        <p className="text-gray-500 mb-6">
          Bạn cần có tài khoản để tiếp tục thanh toán
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dang-nhap">
            <Button variant="primary" size="lg">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/dang-ky">
            <Button variant="outline" size="lg">
              Đăng ký tài khoản
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin giao hàng
        </h2>

        <div className="space-y-4">
          <Input
            label="Họ và tên"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            error={errors.customerName}
            placeholder="Nguyễn Văn A"
            required
          />

          <Input
            label="Số điện thoại"
            name="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={handleChange}
            error={errors.customerPhone}
            placeholder="0912345678"
            required
          />

          <Input
            label="Email"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            error={errors.customerEmail}
            placeholder="email@example.com"
            helperText="Không bắt buộc"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ giao hàng <span className="text-error">*</span>
            </label>
            <textarea
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.customerAddress ? 'border-error' : 'border-gray-300'
              }`}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            />
            {errors.customerAddress && (
              <p className="mt-1 text-sm text-error">{errors.customerAddress}</p>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Date & Time */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thời gian nhận hàng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày nhận hàng
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-gray-500">Để trống nếu muốn giao sớm nhất</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khung giờ nhận hàng
            </label>
            <select
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Bất kỳ khung giờ nào</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Ghi chú
        </h2>
        <textarea
          name="customerNote"
          value={formData.customerNote}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ghi chú về đơn hàng (không bắt buộc)"
        />
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Phương thức thanh toán
        </h2>
        <div className="space-y-3">
          <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleChange}
              className="w-5 h-5 text-primary"
            />
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
              </div>
            </div>
          </label>

          <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={formData.paymentMethod === 'online'}
              onChange={handleChange}
              className="w-5 h-5 text-primary"
            />
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Chuyển khoản ngân hàng</p>
                <p className="text-sm text-gray-500">Chuyển khoản trước khi giao hàng</p>
              </div>
            </div>
          </label>
        </div>

        {formData.paymentMethod === 'online' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-800 mb-3">Thông tin chuyển khoản:</p>
            <div className="text-sm text-blue-700 space-y-1 mb-3">
              <p>Ngân hàng: <span className="font-medium">TPBank</span></p>
              <p>Số tài khoản: <span className="font-medium">29981722000</span></p>
              <p>Chủ tài khoản: <span className="font-medium">VO THI THUY TIEN</span></p>
              <p className="text-xs mt-2 text-blue-600">Nội dung CK: [Số điện thoại] - [Họ tên]</p>
            </div>
            <p className="text-xs text-blue-600 italic">
              * QR code thanh toán sẽ hiển thị sau khi đặt hàng thành công
            </p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
        disabled={items.length === 0}
      >
        Đặt hàng
      </Button>
    </form>
  );
}
