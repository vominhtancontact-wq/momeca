import Link from 'next/link';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

const paymentLabels: Record<string, string> = {
  cod: 'COD',
  online: 'Chuyển khoản',
};

async function getCustomerData(id: string) {
  await dbConnect();
  
  const user = await User.findById(id).lean() as any;
  if (!user) return null;

  // Get orders by phone number
  const orders = await Order.find({ customerPhone: user.phone })
    .sort({ createdAt: -1 })
    .lean() as any[];

  // Calculate stats
  const totalOrders = orders.length;
  const totalSpent = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + ((o.totalAmount || 0) - (o.shippingFee || 0)), 0);

  return { user, orders, totalOrders, totalSpent };
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCustomerData(id);

  if (!data) {
    notFound();
  }

  const { user, orders, totalOrders, totalSpent } = data;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/khach-hang"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Chi tiết khách hàng</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {(user as any).name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{(user as any).name}</h2>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  (user as any).isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {(user as any).isActive ? 'Hoạt động' : 'Đã khóa'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{(user as any).phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{(user as any).email}</span>
              </div>
              {(user as any).address && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{(user as any).address}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">
                  Đăng ký: {new Date((user as any).createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{totalOrders}</p>
                <p className="text-xs text-gray-500">Đơn hàng</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-green-600">
                  {new Intl.NumberFormat('vi-VN').format(totalSpent)}đ
                </p>
                <p className="text-xs text-gray-500">Đã chi tiêu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Lịch sử đơn hàng ({orders.length})</h3>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Khách hàng chưa có đơn hàng nào
              </div>
            ) : (
              <div className="divide-y">
                {orders.map((order: any) => (
                  <div key={order._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          statusLabels[order.status]?.color || 'bg-gray-100'
                        }`}>
                          {statusLabels[order.status]?.label || order.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {paymentLabels[order.paymentMethod] || 'COD'}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-3">
                      {order.items?.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">
                            🦐
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{item.productName}</p>
                            {item.variantName && (
                              <p className="text-xs text-gray-500">{item.variantName}</p>
                            )}
                          </div>
                          <p className="text-gray-600">x{item.quantity}</p>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{order.items.length - 3} sản phẩm khác
                        </p>
                      )}
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-gray-500">
                        {order.shippingFee > 0 ? (
                          <span>Phí ship: {new Intl.NumberFormat('vi-VN').format(order.shippingFee)}đ</span>
                        ) : (
                          <span className="text-green-600">Miễn phí ship</span>
                        )}
                      </div>
                      <p className="font-semibold text-primary">
                        {new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
