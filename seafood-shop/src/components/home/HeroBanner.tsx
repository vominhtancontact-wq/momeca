'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
  buttonText?: string;
}

const defaultBanners: BannerSlide[] = [
  {
    id: 1,
    image: '/images/products/tomsubt.png',
    title: 'Hải Sản IQF',
    subtitle: 'Đông lạnh chuẩn quốc tế • Giao hàng nhanh chóng',
    link: '/san-pham',
    buttonText: 'Mua ngay'
  },
  {
    id: 2,
    image: '/images/products/tomhumbt.png',
    title: 'Freeship Đơn 500K',
    subtitle: 'Miễn phí giao hàng cho đơn từ 500.000đ',
    link: '/san-pham',
    buttonText: 'Xem ngay'
  },
  {
    id: 3,
    image: '/images/products/cuacamau.png',
    title: 'Tôm Cua Cá Mực',
    subtitle: 'Đa dạng sản phẩm • Chất lượng hàng đầu',
    link: '/san-pham',
    buttonText: 'Khám phá'
  }
];

interface HeroBannerProps {
  banners?: BannerSlide[];
}

export default function HeroBanner({ banners = defaultBanners }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  const goToNext = useCallback(() => {
    goToSlide((currentSlide + 1) % banners.length);
  }, [currentSlide, banners.length, goToSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            'absolute inset-0 transition-all duration-700 ease-in-out',
            index === currentSlide 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          )}
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className={cn(
              "max-w-2xl transition-all duration-700 delay-200",
              index === currentSlide 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            )}>
              {/* Title with stylized font */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                {banner.title}
              </h2>
              
              {banner.subtitle && (
                <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 drop-shadow-md">
                  {banner.subtitle}
                </p>
              )}
              
              {banner.link && banner.buttonText && (
                <Link
                  href={banner.link}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span>{banner.buttonText}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Dots - Modern Style */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'transition-all duration-300 rounded-full',
              index === currentSlide 
                ? 'w-10 h-3 bg-white' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            )}
            aria-label={`Đi đến slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </div>
  );
}
