'use client';

import { useState } from 'react';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

interface CustomerListClientProps {
  users: User[];
}

// Mật khẩu để truy cập trang khách hàng (có thể thay đổi)
const ACCESS_PASSWORD = 'momeca2025';

export default function CustomerListClient({ users }: CustomerListClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for security feel
    setTimeout(() => {
      if (password === ACCESS_PASSWORD) {
        setIsUnlocked(true);
        setError('');
      } else {
        setError('Mật khẩu không đúng');
      }
      setIsLoading(false);
    }, 500);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Xác thực bảo mật</h2>
            <p className="text-gray-500 text-sm mt-2">
              Vui lòng nhập mật khẩu để truy cập danh sách khách hàng
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu truy cập
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nhập mật khẩu..."
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin" className="text-sm text-gray-500 hover:text-primary">
              ← Quay lại trang quản trị
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Tổng: {users.length} khách hàng
          </div>
          <button
            onClick={() => setIsUnlocked(false)}
            className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Khóa lại
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có khách hàng nào đăng ký
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Khách hàng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Liên hệ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Địa chỉ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày đăng ký</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user._id.toString().slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{user.phone}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600 max-w-[200px] truncate">
                        {user.address || '-'}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href={`/admin/khach-hang/${user._id}`}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Xem chi tiết
                      </Link>
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
