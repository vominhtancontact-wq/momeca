'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { getCategories } from '@/lib/api';
import { cn } from '@/lib/utils';

// Category icons mapping
const categoryIcons: Record<string, string> = {
  'cua': '🦀',
  'tom': '🦐',
  'ca': '🐟',
  'oc-so': '🐚',
  'muc-bach-tuoc': '🦑',
  'combo': '🎁',
  'default': '🦞'
};

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  price?: string;
  originalPrice?: string;
  link?: string;
  buttonText?: string;
}

const defaultBanners: BannerSlide[] = [
  {
    id: 1,
    image: '/images/products/tomsubt.png',
    title: 'Tôm Sú Bình Thuận',
    subtitle: 'Tươi ngon • Đông lạnh chuẩn IQF',
    link: '/danh-muc/tom',
    buttonText: 'Mua ngay'
  },
  {
    id: 2,
    image: '/images/products/cuacamau.png',
    title: 'Cua Thịt Cà Mau',
    subtitle: 'Thịt chắc • Gạch son đầy mình',
    link: '/danh-muc/cua',
    buttonText: 'Xem ngay'
  },
  {
    id: 3,
    image: '/images/products/cahongbt.png',
    title: 'Cá Hồng Bình Thuận',
    subtitle: 'Tươi sống • Thịt ngọt tự nhiên',
    link: '/danh-muc/ca',
    buttonText: 'Khám phá'
  },
  {
    id: 4,
    image: '/images/products/mucong.png',
    title: 'Mực Ống Bình Thuận',
    subtitle: 'Thịt giòn • Ngọt tự nhiên',
    link: '/danh-muc/muc-bach-tuoc',
    buttonText: 'Đặt ngay'
  }
];

// Side banners data
const sideBanners = [
  {
    id: 1,
    image: '/images/products/tomhumbt.png',
    title: 'Freeship 500K',
    subtitle: 'Miễn phí giao hàng',
    link: '/san-pham',
    bgColor: 'from-amber-400/80 to-orange-400/80'
  },
  {
    id: 2,
    image: '/images/products/ghexanh.png',
    title: 'Hải Sản IQF',
    subtitle: 'Đông lạnh chuẩn quốc tế',
    link: '/san-pham',
    bgColor: 'from-cyan-500/80 to-teal-500/80'
  }
];

// Bottom banners data
const bottomBanners = [
  {
    id: 1,
    image: '/images/products/tomcangxanh.png',
    title: 'Combo Hải Sản',
    subtitle: 'Tiết kiệm đến 20%',
    link: '/danh-muc/combo',
    bgColor: 'from-slate-600/85 to-slate-700/85'
  },
  {
    id: 2,
    image: '/images/products/khosacran.png',
    title: 'Khô & Chế Biến',
    subtitle: 'Đặc sản miền biển',
    discount: 'HOT',
    link: '/danh-muc/kho-che-bien',
    bgColor: 'from-cyan-600/85 to-teal-600/85'
  }
];

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

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
    fetchCategories();
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const goToNext = useCallback(() => {
    goToSlide((currentSlide + 1) % defaultBanners.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <section className="bg-cream py-4">
      <div className="container mx-auto px-4">
        <div className="flex gap-4">
          {/* Left Sidebar - Category Menu */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Menu Header */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>DANH MỤC</span>
                </div>
                <svg className={cn("w-4 h-4 transition-transform", isMenuOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menu Items */}
              <div className={cn(
                "transition-all duration-300 overflow-hidden",
                isMenuOpen ? "max-h-[500px]" : "max-h-0"
              )}>
                <ul className="py-2">
                  {/* Static menu items */}
                  <li>
                    <Link href="/san-pham?sort=bestseller" className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors group">
                      <span className="text-lg">🔥</span>
                      <span className="text-gray-700 group-hover:text-primary font-medium">Bán chạy nhất</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/san-pham?sale=true" className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors group">
                      <span className="text-lg">🏷️</span>
                      <span className="text-gray-700 group-hover:text-primary font-medium">Khuyến mãi</span>
                    </Link>
                  </li>
                  
                  <li className="border-t border-gray-100 my-2"></li>
                  
                  {/* Dynamic categories */}
                  {categories.map((category) => {
                    const icon = categoryIcons[category.slug] || categoryIcons['default'];
                    return (
                      <li key={category._id}>
                        <Link 
                          href={`/danh-muc/${category.slug}`} 
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors group"
                        >
                          <span className="text-lg">{icon}</span>
                          <span className="text-gray-700 group-hover:text-primary">{category.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                  
                  <li className="border-t border-gray-100 my-2"></li>
                  
                  <li>
                    <Link href="/san-pham" className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors group">
                      <span className="text-lg">📦</span>
                      <span className="text-gray-700 group-hover:text-primary font-medium">Tất cả sản phẩm</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Content - Banners */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Slider - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="relative h-[300px] md:h-[350px] rounded-2xl overflow-hidden shadow-lg">
                  {/* Slides */}
                  {defaultBanners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className={cn(
                        'absolute inset-0 transition-all duration-500',
                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      )}
                    >
                      {/* Background */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${banner.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="relative h-full flex items-center p-6 md:p-8">
                        <div className="max-w-md text-white">
                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg"
                              style={{ fontFamily: "'Playfair Display', serif" }}>
                            {banner.title}
                          </h2>
                          {banner.subtitle && (
                            <p className="text-sm md:text-base mb-4 text-white/90">{banner.subtitle}</p>
                          )}
                          
                          {/* Price */}
                          {banner.price && (
                            <div className="mb-4">
                              <span className="text-3xl md:text-4xl font-bold text-accent">{banner.price}</span>
                              {banner.originalPrice && (
                                <span className="ml-2 text-sm line-through text-white/60">{banner.originalPrice}</span>
                              )}
                            </div>
                          )}

                          {banner.link && (
                            <Link
                              href={banner.link}
                              className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
                            >
                              <span>{banner.buttonText || 'Mua ngay'}</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {defaultBanners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                          'transition-all duration-300 rounded-full',
                          index === currentSlide ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Side Banners - 1 column */}
              <div className="hidden lg:flex flex-col gap-4">
                {sideBanners.map((banner) => (
                  <Link
                    key={banner.id}
                    href={banner.link}
                    className="relative h-[167px] rounded-xl overflow-hidden shadow-lg group"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${banner.image})` }}
                    />
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", banner.bgColor)}></div>
                    <div className="relative h-full flex flex-col justify-center p-4 text-white">
                      <h3 className="text-lg font-bold drop-shadow">{banner.title}</h3>
                      <p className="text-sm text-white/90">{banner.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Banners Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {bottomBanners.map((banner) => (
                <Link
                  key={banner.id}
                  href={banner.link}
                  className="relative h-[120px] rounded-xl overflow-hidden shadow-lg group"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${banner.image})` }}
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-r opacity-90", banner.bgColor)}></div>
                  <div className="relative h-full flex items-center justify-between p-4 text-white">
                    <div>
                      <h3 className="text-xl font-bold drop-shadow">{banner.title}</h3>
                      <p className="text-sm text-white/90">{banner.subtitle}</p>
                    </div>
                    {banner.discount && (
                      <div className="bg-secondary px-3 py-1 rounded-full text-sm font-bold">
                        {banner.discount} <span className="text-accent">MUA NGAY</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
