'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PromoBannerItem {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  bgColor: string;
}

const promoBanners: PromoBannerItem[] = [
  {
    id: 1,
    image: '/images/products/tomsubt.png',
    title: 'Tôm Sú Size Lớn',
    subtitle: 'Tươi ngon • Đông lạnh chuẩn IQF',
    link: '/danh-muc/tom',
    bgColor: 'from-cyan-600 to-teal-600'
  },
  {
    id: 2,
    image: '/images/products/cuacamau.png',
    title: 'Cua Thịt Cà Mau',
    subtitle: 'Gạch son đầy mình • Freeship đơn 500K',
    link: '/danh-muc/cua',
    bgColor: 'from-slate-600 to-slate-700'
  },
  {
    id: 3,
    image: '/images/products/cahongbt.png',
    title: 'Cá Hồng Bình Thuận',
    subtitle: 'Tươi sống • Thịt ngọt tự nhiên',
    link: '/danh-muc/ca',
    bgColor: 'from-amber-500 to-orange-500'
  },
  {
    id: 4,
    image: '/images/products/tomcangxanh.png',
    title: 'Combo Hải Sản',
    subtitle: 'Tiết kiệm hơn • Đủ cho cả gia đình',
    link: '/danh-muc/combo',
    bgColor: 'from-teal-500 to-cyan-500'
  },
];

export default function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % promoBanners.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section 
      className="py-6 bg-cream"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          {/* Slides Container */}
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {promoBanners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.link}
                className="w-full flex-shrink-0 relative group"
              >
                <div className={cn(
                  "relative h-[120px] md:h-[150px] lg:h-[180px] bg-gradient-to-r overflow-hidden",
                  banner.bgColor
                )}>
                  {/* Background Image */}
                  <div 
                    className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundImage: `url(${banner.image})` }}
                  />
                  
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
                    <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-white/10 rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex items-center px-6 md:px-10">
                    <div className="text-white max-w-lg">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 drop-shadow-lg">
                        {banner.title}
                      </h3>
                      {banner.subtitle && (
                        <p className="text-sm md:text-base text-white/90 mb-3">
                          {banner.subtitle}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium group-hover:bg-white/30 transition-colors">
                        Xem ngay
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {promoBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'transition-all duration-300 rounded-full',
                  index === currentIndex 
                    ? 'w-6 h-2 bg-white' 
                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Đi đến slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
