'use client';

import { useState, useEffect, useRef } from 'react';

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ẩn khi đang cuộn
      setIsVisible(false);
      
      // Clear timeout cũ nếu có
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Hiện lại sau khi ngừng cuộn 300ms
      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Desktop: góc phải dọc | Mobile: đáy màn hình ngang */}
      <div className={`fixed z-50 
        bottom-5 right-5 flex-col gap-4 hidden md:flex items-center
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}>
        {/* Phone Button - với hiệu ứng tỏa nước */}
        <a
          href="tel:0899630279"
          className="relative group animate-float"
          aria-label="Gọi điện"
        >
          {/* Water ripple rings */}
          <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-water-ripple-1"></span>
          <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-water-ripple-2"></span>
          <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-water-ripple-3"></span>
          {/* Button */}
          <div className="relative w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </div>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Hotline
          </span>
        </a>

        {/* Zalo Button */}
        <a
          href="https://zalo.me/0899630279"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group animate-float animation-delay-200"
          aria-label="Chat Zalo"
        >
          <div className="relative w-12 h-12 bg-[#0068FF] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer">
            <span className="text-white font-bold text-sm tracking-tight">Zalo</span>
          </div>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat Zalo
          </span>
        </a>

        {/* Messenger Button */}
        <a
          href="https://m.me/61586557799137"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group animate-float animation-delay-400"
          aria-label="Messenger"
        >
          <div className="relative w-12 h-12 bg-gradient-to-br from-[#00B2FF] to-[#006AFF] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.02.57.61.94 1.13.71l1.98-.87c.17-.08.36-.1.55-.06.91.25 1.87.38 2.88.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.89 7.58l-2.89 4.58c-.46.73-1.44.92-2.13.42l-2.3-1.72a.6.6 0 00-.72 0l-3.1 2.35c-.41.31-.95-.18-.68-.62l2.89-4.58c.46-.73 1.44-.92 2.13-.42l2.3 1.72a.6.6 0 00.72 0l3.1-2.35c.41-.31.95.18.68.62z"/>
            </svg>
          </div>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Messenger
          </span>
        </a>
      </div>

      {/* Mobile: thanh ngang ở đáy màn hình */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="flex items-center justify-center gap-10 py-2 px-4">
          {/* Phone Button */}
          <a
            href="tel:0899630279"
            className="flex flex-col items-center gap-1"
            aria-label="Gọi điện"
          >
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
            <span className="text-[10px] font-medium text-gray-600">Hotline</span>
          </a>

          {/* Zalo Button */}
          <a
            href="https://zalo.me/0899630279"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1"
            aria-label="Chat Zalo"
          >
            <div className="w-10 h-10 bg-[#0068FF] rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs tracking-tight">Zalo</span>
            </div>
            <span className="text-[10px] font-medium text-gray-600">Zalo</span>
          </a>

          {/* Messenger Button */}
          <a
            href="https://m.me/61586557799137"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1"
            aria-label="Messenger"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#00B2FF] to-[#006AFF] rounded-full flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.02.57.61.94 1.13.71l1.98-.87c.17-.08.36-.1.55-.06.91.25 1.87.38 2.88.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.89 7.58l-2.89 4.58c-.46.73-1.44.92-2.13.42l-2.3-1.72a.6.6 0 00-.72 0l-3.1 2.35c-.41.31-.95-.18-.68-.62l2.89-4.58c.46-.73 1.44-.92 2.13-.42l2.3 1.72a.6.6 0 00.72 0l3.1-2.35c.41-.31.95.18.68.62z"/>
              </svg>
            </div>
            <span className="text-[10px] font-medium text-gray-600">Messenger</span>
          </a>
        </div>
      </div>
    </>
  );
}
