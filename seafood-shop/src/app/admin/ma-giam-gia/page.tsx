'use client';

import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Coupon {
  _id: string;
  code: string;
  userId: User;
  type: 'fixed' | 'percent';
  value: number;
  minOrderValue: number;
  maxUsage: number;
  usedCount: number;
  status: 'active' | 'used' | 'expired';
  tierLevel: number;
  expiresAt: string;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Còn hiệu lực', color: 'bg-green-100 text-green-800' },
  used: { label: 'Đã sử dụng', color: 'bg-blue-100 text-blue-800' },
  expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-800' },
};

const tierLabels: Record<number, string> = {
  500000: 'Bạc',
  1000000: 'Vàng',
  2000000: 'Kim Cương',
};

export default function CouponManagementPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa mã giảm giá này?')) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCoupons();
      } else {
        alert('Có lỗi xảy ra khi xóa');
      }
    } catch {
      alert('Có lỗi xảy ra');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesFilter = filter === 'all' || coupon.status === filter;
    const matchesSearch =
      searchTerm === '' ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.userId?.phone?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.status === 'active').length,
    used: coupons.filter((c) => c.status === 'used').length,
    expired: coupons.filter((c) => c.status === 'expired').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Tổng mã</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Còn hiệu lực</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Đã sử dụng</p>
          <p className="text-2xl font-bold text-blue-600">{stats.used}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Hết hạn</p>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Tìm theo mã, tên KH, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="flex gap-2">
            {(['all', 'active', 'used', 'expired'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Tất cả' : statusLabels[status].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredCoupons.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không có mã giảm giá nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Mã</th>
                  <th className="text-left py-3 px-4">Khách hàng</th>
                  <th className="text-left py-3 px-4">Giá trị</th>
                  <th className="text-left py-3 px-4">Hạng</th>
                  <th className="text-left py-3 px-4">Sử dụng</th>
                  <th className="text-left py-3 px-4">Hết hạn</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-primary">{coupon.code}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{coupon.userId?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{coupon.userId?.phone || ''}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">
                        {coupon.type === 'fixed' ? formatPrice(coupon.value) : `${coupon.value}%`}
                      </span>
                      {coupon.minOrderValue > 0 && (
                        <p className="text-xs text-gray-500">
                          Đơn tối thiểu: {formatPrice(coupon.minOrderValue)}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{tierLabels[coupon.tierLevel] || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {coupon.usedCount}/{coupon.maxUsage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(coupon.expiresAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusLabels[coupon.status]?.color || 'bg-gray-100'
                        }`}
                      >
                        {statusLabels[coupon.status]?.label || coupon.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Xóa
                      </button>
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
