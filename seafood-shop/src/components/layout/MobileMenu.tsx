'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { getCategories } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-cream via-white to-cream">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-primary p-0.5 bg-white shadow-md">
              <img 
                src="/images/logo.png" 
                alt="Mỡ Mê Cá" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                <span className="text-primary">Mỡ</span>
                <span className="text-secondary mx-0.5">Mê</span>
                <span className="text-primary">Cá</span>
              </h2>
              <p className="text-[9px] text-gray-500 -mt-0.5 tracking-wider uppercase">Hải sản IQF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
            aria-label="Đóng menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Trang chủ</span>
              </Link>
            </li>

            <li className="pt-2">
              <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Danh mục
              </span>
            </li>

            {categories.map((category) => (
              <li key={category._id}>
                <Link
                  href={`/danh-muc/${category.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors group"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                    🐟
                  </span>
                  <span className="group-hover:text-primary transition-colors">{category.name}</span>
                </Link>
              </li>
            ))}

            <li className="pt-2">
              <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Khác
              </span>
            </li>

            <li>
              <Link
                href="/san-pham"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Tất cả sản phẩm</span>
              </Link>
            </li>

            <li>
              <Link
                href="/gio-hang"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Giỏ hàng</span>
              </Link>
            </li>

            {/* Auth Section */}
            <li className="pt-2">
              <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Tài khoản
              </span>
            </li>

            {isAuthenticated && user ? (
              <>
                <li>
                  <Link
                    href="/tai-khoan"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{user.name}</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/dang-nhap"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng nhập</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dang-ky"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Đăng ký</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Contact Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Hotline đặt hàng</p>
                <a href="tel:1900xxxx" className="text-lg font-bold text-primary">
                  1900 xxxx
                </a>
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="mt-4 p-3 bg-secondary/10 rounded-xl text-center">
            <p className="text-sm text-secondary font-medium">🎉 Miễn phí giao hàng đơn từ 500k</p>
          </div>
        </nav>
      </div>
    </>
  );
}
