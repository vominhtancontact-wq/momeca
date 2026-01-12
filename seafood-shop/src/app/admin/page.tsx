import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Product, Category, Order, User } from '@/models';

export const dynamic = 'force-dynamic';

async function getStats() {
  await dbConnect();
  
  const [totalProducts, totalCategories, totalOrders, totalCustomers, recentOrders] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: { $ne: 'admin' } }),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  
  const orders = await Order.find({ status: 'delivered' }).lean();
  const totalRevenue = orders.reduce((sum, order) => {
    const productAmount = (order.totalAmount || 0) - (order.shippingFee || 0);
    return sum + productAmount;
  }, 0);

  return {
    totalProducts,
    totalCategories,
    totalOrders,
    totalCustomers,
    pendingOrders,
    totalRevenue,
    recentOrders,
  };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xử lý', color: 'text-amber-700', bg: 'bg-amber-100' },
  confirmed: { label: 'Đã xác nhận', color: 'text-blue-700', bg: 'bg-blue-100' },
  shipping: { label: 'Đang giao', color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { label: 'Đã giao', color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100' },
};

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { 
      label: 'Tổng sản phẩm', 
      value: stats.totalProducts, 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      href: '/admin/san-pham'
    },
    { 
      label: 'Danh mục', 
      value: stats.totalCategories, 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      href: '/admin/danh-muc'
    },
    { 
      label: 'Khách hàng', 
      value: stats.totalCustomers, 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: 'from-cyan-500 to-cyan-600',
      href: '/admin/khach-hang'
    },
    { 
      label: 'Tổng đơn hàng', 
      value: stats.totalOrders, 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      gradient: 'from-violet-500 to-violet-600',
      href: '/admin/don-hang'
    },
    { 
      label: 'Đơn chờ xử lý', 
      value: stats.pendingOrders, 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-amber-600',
      href: '/admin/don-hang'
    },
    { 
      label: 'Doanh thu', 
      value: new Intl.NumberFormat('vi-VN').format(stats.totalRevenue) + 'đ', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-rose-500 to-rose-600',
      href: '/admin/don-hang'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-cyan-500/20">
        <h1 className="text-2xl font-bold mb-2">Chào mừng trở lại! 👋</h1>
        <p className="text-cyan-100">Đây là tổng quan hoạt động của cửa hàng Mỡ Mê Cá</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Đơn hàng gần đây</h2>
            <p className="text-sm text-slate-500">5 đơn hàng mới nhất</p>
          </div>
          <Link 
            href="/admin/don-hang"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
          >
            Xem tất cả
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {stats.recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-500">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày đặt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((order: any) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm font-medium text-slate-800">
                          #{order._id.toString().slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                            {order.customerName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="text-sm text-slate-700">{order.customerName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-slate-800">
                          {new Intl.NumberFormat('vi-VN').format(order.totalAmount || 0)}đ
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
