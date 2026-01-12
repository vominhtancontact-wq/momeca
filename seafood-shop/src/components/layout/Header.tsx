'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import SearchBar from '@/components/search/SearchBar';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Promotional */}
      <div className="bg-secondary text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-center items-center gap-4">
          <span>🎉 Miễn phí giao hàng đơn từ 500k</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">⚡ Giao hàng trong 2h nội thành</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-cream shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Mở menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo Section - Modern Design matching logo style */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-4">
                {/* Logo Image with cyan border like the logo */}
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-primary bg-cream p-1 shadow-md group-hover:shadow-lg transition-all">
                    <img 
                      src="/images/logo.png" 
                      alt="Mỡ mê Cá" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  {/* Fish icon badge - matching logo style */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <span className="text-white text-sm">🐟</span>
                  </div>
                </div>
                
                {/* Brand Name - Typography matching logo */}
                <div className="hidden sm:block">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    <span className="text-primary">Mỡ </span>
                    <span className="text-secondary">mê </span>
                    <span className="text-primary">Cá</span>
                  </h1>
                  <p className="text-xs text-gray-500 tracking-[0.2em] uppercase mt-0.5">
                    Hải sản IQF
                  </p>
                </div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-xl mx-6">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Phone - Desktop */}
              <a
                href="tel:0899630279"
                className="hidden lg:flex items-center gap-3 px-4 py-2 hover:bg-primary/5 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400">Hotline</p>
                  <p className="font-semibold text-gray-700">0899 630 279</p>
                </div>
              </a>

              {/* User Auth */}
              {mounted && (
                isAuthenticated && user ? (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      href="/tai-khoan"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                        {user.name}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Đăng xuất"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/dang-nhap"
                    className="hidden md:flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium">Đăng nhập</span>
                  </Link>
                )
              )}

              {/* Cart */}
              <Link
                href="/gio-hang"
                className="relative p-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-md hover:shadow-lg group"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden mt-3">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
