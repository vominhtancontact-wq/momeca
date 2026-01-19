import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Order } from '@/models';
import OrderStatusSelectClient from '../OrderStatusSelectClient';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  await dbConnect();
  const order = await Order.findById(id).lean();
  return order;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đơn hàng</h1>
        <Link href="/admin/don-hang" className="text-primary hover:underline">
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipping: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };

  const paymentMethodLabels: Record<string, string> = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    online: 'Chuyển khoản ngân hàng',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/don-hang" className="text-primary hover:underline text-sm mb-2 inline-block">
          ← Quay lại danh sách đơn hàng
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
            <p className="text-gray-500 mt-1">
              Mã đơn: <span className="font-mono font-semibold">{order.orderNumber || order._id.toString().slice(-8).toUpperCase()}</span>
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Họ tên</label>
                <p className="font-medium text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Số điện thoại</label>
                <p className="font-medium text-gray-900">{order.customerPhone}</p>
              </div>
              {order.customerEmail && (
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium text-gray-900">{order.customerEmail}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Địa chỉ giao hàng</label>
                <p className="font-medium text-gray-900">{order.customerAddress}</p>
              </div>
              {order.customerNote && (
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">Ghi chú</label>
                  <p className="font-medium text-gray-900">{order.customerNote}</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          {(order.deliveryDate || order.deliveryTime) && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thời gian giao hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.deliveryDate && (
                  <div>
                    <label className="text-sm text-gray-500">Ngày giao</label>
                    <p className="font-medium text-gray-900">{order.deliveryDate}</p>
                  </div>
                )}
                {order.deliveryTime && (
                  <div>
                    <label className="text-sm text-gray-500">Khung giờ</label>
                    <p className="font-medium text-gray-900">{order.deliveryTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm đã đặt</h2>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  {item.productImage && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    {item.variantName && (
                      <p className="text-sm text-gray-500">Phân loại: {item.variantName}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái đơn hàng</h2>
            <OrderStatusSelectClient
              orderId={order._id.toString()}
              currentStatus={order.status}
            />
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thanh toán</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Giảm giá {order.couponCode && `(${order.couponCode})`}
                  </span>
                  <span className="font-medium text-green-600">-{formatPrice(order.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium">
                  {order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Tổng cộng</span>
                <span className="font-bold text-xl text-primary">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                <p className="font-medium text-gray-900 mt-1">
                  {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Ngày đặt hàng</span>
                <p className="font-medium text-gray-900 mt-1">
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              {order.updatedAt && order.updatedAt !== order.createdAt && (
                <div>
                  <span className="text-gray-600">Cập nhật lần cuối</span>
                  <p className="font-medium text-gray-900 mt-1">
                    {new Date(order.updatedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
