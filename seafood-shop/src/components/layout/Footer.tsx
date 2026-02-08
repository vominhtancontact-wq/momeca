'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary"></div>
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/20 p-0.5 bg-white/10 backdrop-blur shadow-lg flex-shrink-0">
                <img src="/images/logo.png" alt="Mỡ Mê Cá" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">
                  <span className="text-white">Mỡ</span>
                  <span className="text-accent mx-1">Mê</span>
                  <span className="text-white">Cá</span>
                </h3>
                <p className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase">Hải sản IQF</p>
              </div>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-gray-400">
              Chuyên cung cấp hải sản tươi sống và IQF chất lượng cao. Cam kết nguồn gốc rõ ràng, giao hàng nhanh chóng.
            </p>
            
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 md:w-11 md:h-11 bg-white/5 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1" aria-label="Facebook">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
              <a href="https://zalo.me/0899630279" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-11 md:h-11 bg-white/5 hover:bg-cyan-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1" aria-label="Zalo">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-bold text-white mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
              <span className="w-1.5 md:w-2 h-6 md:h-7 bg-gradient-to-b from-accent to-orange-400 rounded-full"></span>
              Liên kết nhanh
            </h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="text-accent">›</span>
                  <span className="group-hover:translate-x-1 transition-transform">Trang chủ</span>
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="text-accent">›</span>
                  <span className="group-hover:translate-x-1 transition-transform">Sản phẩm</span>
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu-don-hang" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="text-accent">›</span>
                  <span className="group-hover:translate-x-1 transition-transform">Tra cứu đơn hàng</span>
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="text-accent">›</span>
                  <span className="group-hover:translate-x-1 transition-transform">Giới thiệu</span>
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="text-accent">›</span>
                  <span className="group-hover:translate-x-1 transition-transform">Liên hệ</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-bold text-white mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
              <span className="w-1.5 md:w-2 h-6 md:h-7 bg-gradient-to-b from-primary to-cyan-400 rounded-full"></span>
              Chính sách
            </h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li>
                <Link href="/chinh-sach-giao-hang" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="text-primary">›</span>
                  <span className="group-hover:translate-x-1 transition-transform">Chính sách giao hàng</span>
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="text-primary">›</span>
                  <span className="group-hover:translate-x-1 transition-transform">Chính sách đổi trả</span>
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="text-primary">›</span>
                  <span className="group-hover:translate-x-1 transition-transform">Chính sách bảo mật</span>
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan-su-dung" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="text-primary">›</span>
                  <span className="group-hover:translate-x-1 transition-transform">Điều khoản sử dụng</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-bold text-white mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
              <span className="w-1.5 md:w-2 h-6 md:h-7 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
              Liên hệ
            </h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <li className="flex items-start gap-2 md:gap-3 group">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white/5 group-hover:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">105/3 đường Suối Dinh, ấp Lộc Hòa, xã Hưng Thịnh, tỉnh Đồng Nai</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3 group">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white/5 group-hover:bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href="tel:0899630279" className="text-gray-400 hover:text-white transition-colors font-semibold text-sm md:text-base">0899 630 279</a>
              </li>
              <li className="flex items-center gap-2 md:gap-3 group">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white/5 group-hover:bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href="mailto:nghiennhi279@gmail.com" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm break-all">nghiennhi279@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
          <p className="flex items-center gap-2 text-center">
            <span>©</span> {new Date().getFullYear()} <span className="text-white font-medium">Mỡ Mê Cá</span>. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center text-[10px] md:text-sm">
            <span className="text-gray-600">Design by</span>
            <span className="text-accent font-semibold">Võ Minh Tân</span>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <a href="tel:0337854179" className="hover:text-white transition-colors">0337 854 179</a>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <a href="mailto:vominhtan.contact@gmail.com" className="hover:text-white transition-colors hidden sm:inline">vominhtan.contact@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
