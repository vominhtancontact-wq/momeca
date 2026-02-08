'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Coupon {
  _id: string;
  code: string;
  type: string;
  value: number;
  minOrderValue: number;
  maxUsage: number;
  usedCount: number;
  expiresAt: string;
  tierLevel: number;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

const TIER_CONFIG = [
  { threshold: 500000, discount: 20000, name: 'Bạc', color: 'from-gray-400 to-gray-500' },
  { threshold: 1000000, discount: 40000, name: 'Vàng', color: 'from-yellow-400 to-yellow-500' },
  { threshold: 2000000, discount: 80000, name: 'Kim Cương', color: 'from-cyan-400 to-blue-500' },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [tierLevel, setTierLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/dang-nhap');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (user?.phone) {
      fetchOrders();
      fetchCoupons();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (!user?.phone) {
        console.log('No user phone found');
        setLoading(false);
        return;
      }

      console.log('User phone:', user.phone);
      console.log('Fetching orders for phone:', user.phone);

      // Fetch orders by phone number (works for both old and new orders)
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(user.phone)}&limit=10`, {
        credentials: 'include'
      });
      
      const data = await res.json();
      console.log('Orders API response:', data);
      console.log('Orders found:', data.data?.length || 0);
      
      if (data.success) {
        setOrders(data.data);
        console.log('Orders loaded:', data.data.length);
        
        // Debug: log first order's phone if exists
        if (data.data.length > 0) {
          console.log('First order customerPhone:', data.data[0].customerPhone);
        }
      } else {
        console.error('Failed to fetch orders:', data.error);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      // Get token from zustand persisted storage
      const authStorage = localStorage.getItem('auth-storage');
      let token = null;
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token;
      }
      
      if (!token) {
        console.log('No token found');
        return;
      }
      
      const res = await fetch('/api/coupons', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data.coupons || []);
        setTotalSpent(data.data.totalSpent || 0);
        setTierLevel(data.data.tierLevel || 0);
      } else {
        console.error('Coupons API error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCurrentTier = () => {
    return TIER_CONFIG.find(t => t.threshold === tierLevel);
  };

  const getNextTier = () => {
    for (const tier of TIER_CONFIG) {
      if (totalSpent < tier.threshold) {
        return { ...tier, remaining: tier.threshold - totalSpent };
      }
    }
    return null;
  };

  if (!mounted || !isAuthenticated) {
    return <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{user?.phone}</span>
              </div>
              {user?.address && (
                <div className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{user.address}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              <Link href="/tai-khoan/chinh-sua">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa thông tin
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Hạng thành viên</h3>
            
            {currentTier ? (
              <div className={`bg-gradient-to-r ${currentTier.color} rounded-lg p-4 text-white mb-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold">{currentTier.name}</span>
                </div>
                <p className="text-sm opacity-90">Đã chi tiêu: {formatPrice(totalSpent)}</p>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <p className="text-gray-600 text-sm">Chưa có hạng thành viên</p>
                <p className="text-gray-500 text-xs mt-1">Đã chi tiêu: {formatPrice(totalSpent)}</p>
              </div>
            )}

            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Còn {formatPrice(nextTier.remaining)}</span>
                  <span className="text-gray-500">để đạt hạng {nextTier.name}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min((totalSpent / nextTier.threshold) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  🎁 Nhận mã giảm {formatPrice(nextTier.discount)} khi đạt hạng
                </p>
              </div>
            )}

            {!nextTier && currentTier && (
              <p className="text-sm text-green-600 font-medium">
                🎉 Bạn đã đạt hạng cao nhất!
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coupons */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mã giảm giá của bạn</h2>
              <span className="text-sm text-gray-500">{coupons.length} mã</span>
            </div>

            {coupons.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <p className="text-gray-500 text-sm">Chưa có mã giảm giá</p>
                <p className="text-gray-400 text-xs mt-1">Mua sắm để nhận mã giảm giá!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="border border-dashed border-primary/50 rounded-lg p-4 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary text-lg">{coupon.code}</span>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="text-gray-400 hover:text-primary transition-colors"
                          >
                            {copiedCode === coupon.code ? (
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Giảm {formatPrice(coupon.value)} • Đơn tối thiểu {formatPrice(coupon.minOrderValue)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          HSD: {new Date(coupon.expiresAt).toLocaleDateString('vi-VN')} • 
                          Còn {coupon.maxUsage - coupon.usedCount} lượt
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                          -{formatPrice(coupon.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
              <Link href="/tra-cuu-don-hang" className="text-primary text-sm hover:underline">
                Xem tất cả
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-20" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                <Link href="/">
                  <Button variant="primary" className="mt-4">
                    Mua sắm ngay
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="block p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{formatPrice(order.totalAmount)}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusLabels[order.status]?.color || 'bg-gray-100'}`}>
                          {statusLabels[order.status]?.label || order.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Payment status for online orders */}
                    {(order as any).paymentMethod === 'online' && (order as any).paymentStatus === 'pending' && (
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-yellow-600 font-medium">
                          ⏳ Chờ thanh toán
                        </span>
                        <Link
                          href={`/cho-thanh-toan?orderNumber=${order.orderNumber}`}
                          className="text-sm text-primary hover:underline font-medium"
                        >
                          Xem QR thanh toán →
                        </Link>
                      </div>
                    )}
                    
                    {(order as any).paymentMethod === 'online' && (order as any).paymentStatus === 'paid' && (
                      <div className="pt-3 border-t">
                        <span className="text-sm text-green-600 font-medium">
                          ✓ Đã thanh toán
                        </span>
                      </div>
                    )}
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
