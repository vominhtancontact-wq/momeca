'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-700 to-slate-800 text-gray-200">
      {/* Wave decoration */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full border-2 border-white/30 p-0.5 bg-white/10 backdrop-blur">
                <img 
                  src="/images/logo.png" 
                  alt="Mỡ Mê Cá" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  <span className="text-white">Mỡ</span>
                  <span className="text-accent mx-1">Mê</span>
                  <span className="text-white">Cá</span>
                </h3>
                <p className="text-[10px] text-gray-400 tracking-wider uppercase">Hải sản IQF</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              Chuyên cung cấp hải sản tươi sống và IQF chất lượng cao. 
              Cam kết nguồn gốc rõ ràng, giao hàng nhanh chóng.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
              <a href="https://zalo.me/0899630279" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors" aria-label="Zalo">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full"></span>
              Liên kết nhanh
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu-don-hang" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> Tra cứu đơn hàng
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full"></span>
              Chính sách
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chinh-sach-giao-hang" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan-su-dung" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full"></span>
              Liên hệ
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-300">105/3 đường Suối Dinh, ấp Lộc Hòa, xã Hưng Thịnh, tỉnh Đồng Nai</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href="tel:0899630279" className="hover:text-accent transition-colors font-semibold">
                  0899 630 279
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <a href="mailto:nghiennhi279@gmail.com" className="hover:text-accent transition-colors">
                    nghiennhi279@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Mỡ Mê Cá. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-2">
            <span>Design by</span>
            <span className="text-accent font-medium">Võ Minh Tân</span>
            <span>|</span>
            <a href="tel:0337854179" className="hover:text-accent transition-colors">0337 854 179</a>
            <span>|</span>
            <a href="mailto:vominhtan.contact@gmail.com" className="hover:text-accent transition-colors">vominhtan.contact@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
