import dbConnect from '@/lib/db';
import { Order } from '@/models';
import OrderStatusSelectClient from './OrderStatusSelectClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getOrders() {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return orders;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có đơn hàng nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Mã đơn</th>
                  <th className="text-left py-3 px-4">Khách hàng</th>
                  <th className="text-left py-3 px-4">Điện thoại</th>
                  <th className="text-left py-3 px-4">Địa chỉ</th>
                  <th className="text-left py-3 px-4">Sản phẩm</th>
                  <th className="text-left py-3 px-4">Tổng tiền</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm">
                        {order._id.toString().slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.customerName || 'N/A'}</td>
                    <td className="py-3 px-4">{order.customerPhone || 'N/A'}</td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      {order.customerAddress || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {order.items?.slice(0, 2).map((item: any, index: number) => (
                          <div key={index} className="truncate max-w-[150px]">
                            {item.productName} x{item.quantity}
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="text-gray-500">
                            +{order.items.length - 2} sản phẩm khác
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount || 0)}
                    </td>
                    <td className="py-3 px-4">
                      <OrderStatusSelectClient
                        orderId={order._id.toString()}
                        currentStatus={order.status}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
