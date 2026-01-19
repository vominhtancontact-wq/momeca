'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import SearchBar from '@/components/search/SearchBar';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/san-pham', label: 'Sản phẩm' },
  { href: '/kien-thuc-hai-san', label: 'Kiến thức' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Promotional */}
      <div className="bg-gradient-to-r from-secondary via-red-500 to-secondary text-white text-xs py-2 overflow-hidden">
        <div className="container mx-auto px-4 flex justify-center items-center gap-4">
          <span className="flex items-center gap-1.5 animate-pulse-soft">
            <span>🎉</span> Miễn phí giao hàng đơn từ 500k
          </span>
          <span className="hidden sm:inline text-white/50">|</span>
          <span className="hidden sm:inline flex items-center gap-1.5">
            <span>⚡</span> Giao hàng trong 2h nội thành
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-cream/95 backdrop-blur-md shadow-sm border-b border-gray-100/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 -ml-2 text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 active:scale-95"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Mở menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo Section */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary bg-cream p-0.5 shadow-md group-hover:shadow-lg transition-all duration-300">
                    <img 
                      src="/images/logo.png" 
                      alt="Mỡ mê Cá" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    <span className="text-primary">Mỡ </span>
                    <span className="text-secondary">mê </span>
                    <span className="text-primary">Cá</span>
                  </h1>
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase">Hải sản tươi sống</p>
                </div>
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1 ml-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-[16px] font-medium rounded-lg transition-colors",
                    isActive(link.href) 
                      ? "text-primary bg-primary/5" 
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-2xl mx-6">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* User Auth */}
              {mounted && (
                isAuthenticated && user ? (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      href="/tai-khoan"
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-primary/5 rounded-xl transition-all duration-300 group/user"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover/user:bg-primary group-hover/user:shadow-md transition-all duration-300">
                        <svg className="w-4 h-4 text-primary group-hover/user:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate group-hover/user:text-primary transition-colors">
                        {user.name}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 active:scale-95"
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
                    className="hidden md:flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-300 font-medium hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[14px]">Đăng nhập</span>
                  </Link>
                )
              )}

              {/* Cart */}
              <Link
                href="/gio-hang"
                className="relative p-3.5 bg-gradient-to-br from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30 group/cart active:scale-95"
              >
                <svg className="w-6 h-6 group-hover/cart:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-secondary to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-scale-in">
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
