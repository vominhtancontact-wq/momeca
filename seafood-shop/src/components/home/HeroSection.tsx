'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { getCategories } from '@/lib/api';
import { cn } from '@/lib/utils';

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  highlight?: string;
  link?: string;
  buttonText?: string;
  gradient: string;
}

const defaultBanners: BannerSlide[] = [
  {
    id: 1,
    image: '/images/products/tomsubt.png',
    title: 'Tôm Sú Bình Thuận',
    subtitle: 'Tươi ngon • Đông lạnh chuẩn IQF',
    highlight: 'BEST SELLER',
    link: '/danh-muc/tom',
    buttonText: 'Mua ngay',
    gradient: 'from-cyan-900/90 via-cyan-800/70 to-transparent'
  },
  {
    id: 2,
    image: '/images/products/cuacamau.png',
    title: 'Cua Thịt Cà Mau',
    subtitle: 'Gạch son đầy mình • Freeship đơn 500K',
    highlight: 'ĐẶC SẢN',
    link: '/danh-muc/cua',
    buttonText: 'Xem ngay',
    gradient: 'from-slate-900/90 via-slate-800/70 to-transparent'
  },
  {
    id: 3,
    image: '/images/products/cahongbt.png',
    title: 'Cá Hồng Bình Thuận',
    subtitle: 'Tươi sống • Thịt ngọt tự nhiên',
    highlight: 'MỚI VỀ',
    link: '/danh-muc/ca',
    buttonText: 'Khám phá',
    gradient: 'from-blue-900/90 via-blue-800/70 to-transparent'
  },
  {
    id: 4,
    image: '/images/products/mucong.png',
    title: 'Mực Ống Bình Thuận',
    subtitle: 'Thịt giòn • Ngọt tự nhiên',
    highlight: 'HOT DEAL',
    link: '/danh-muc/muc-bach-tuoc',
    buttonText: 'Đặt ngay',
    gradient: 'from-indigo-900/90 via-indigo-800/70 to-transparent'
  }
];

const sideBanners = [
  {
    id: 1,
    image: '/images/products/tomhumbt.png',
    title: 'Freeship 500K',
    subtitle: 'Miễn phí giao hàng',
    icon: '🚚',
    link: '/san-pham',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 2,
    image: '/images/products/ghexanh.png',
    title: 'Hải Sản IQF',
    subtitle: 'Đông lạnh chuẩn quốc tế',
    icon: '❄️',
    link: '/san-pham',
    gradient: 'from-cyan-500 to-teal-600'
  }
];

const bottomBanners = [
  {
    id: 1,
    image: '/images/products/tomcangxanh.png',
    title: 'Combo Hải Sản',
    subtitle: 'Tiết kiệm đến 20%',
    badge: 'SALE',
    link: '/combo',
    gradient: 'from-slate-700 to-slate-900'
  },
  {
    id: 2,
    image: '/images/products/khosacran.png',
    title: 'Khô & Chế Biến',
    subtitle: 'Đặc sản miền biển',
    badge: 'HOT',
    link: '/danh-muc/kho-che-bien',
    gradient: 'from-teal-600 to-cyan-800'
  }
];

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

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
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const goToNext = useCallback(() => {
    goToSlide((currentSlide + 1) % defaultBanners.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex gap-5">
          {/* Left Sidebar - Category Menu */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-[556px] flex flex-col">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-semibold">DANH MỤC SẢN PHẨM</span>
                </div>
                <svg className={cn("w-4 h-4 transition-transform duration-300", isMenuOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={cn("transition-all duration-500 overflow-y-auto flex-1", isMenuOpen ? "max-h-full" : "max-h-0")}>
                <ul className="py-3 h-full flex flex-col justify-between">
                  <li>
                    <Link href="/san-pham?sort=bestseller" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all duration-300 group border-l-4 border-transparent hover:border-orange-500">
                      <span className="text-base min-w-[20px] emoji">🔥</span>
                      <span className="text-[15px] text-gray-700 group-hover:text-orange-600 font-medium transition-colors flex-1">Bán chạy nhất</span>
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">HOT</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/san-pham?sale=true" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all duration-300 group border-l-4 border-transparent hover:border-red-500">
                      <span className="text-base min-w-[20px] emoji">🏷️</span>
                      <span className="text-[15px] text-gray-700 group-hover:text-red-600 font-medium transition-colors flex-1">Khuyến mãi</span>
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">SALE</span>
                    </Link>
                  </li>
                  <li className="border-t border-gray-100 mx-4"></li>
                  {categories.map((category, index) => {
                    // Get icon based on category name
                    let icon = '🦞';
                    if (category.name === 'Tôm') icon = '🦐';
                    else if (category.name === 'Cá') icon = '🐟';
                    else if (category.name === 'Mực') icon = '🦑';
                    else if (category.name === 'Ghẹ & Cua') icon = '🦀';
                    else if (category.name === 'Ốc & Sò') icon = '🐚';
                    else if (category.name === 'Khô & Chế biến') icon = '🍤';
                    else if (category.name === 'Combo') icon = '🎁';
                    
                    return (
                      <li key={category._id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                        <Link href={`/danh-muc/${category.slug}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 group border-l-4 border-transparent hover:border-primary">
                          <span className="text-base min-w-[20px] emoji">{icon}</span>
                          <span className="text-[15px] text-gray-700 group-hover:text-primary transition-colors flex-1">{category.name}</span>
                          <svg className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    );
                  })}
                  <li className="border-t border-gray-100 mx-4"></li>
                  <li>
                    <Link href="/san-pham" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 group border-l-4 border-transparent hover:border-primary">
                      <span className="text-base min-w-[20px] emoji">📦</span>
                      <span className="text-[15px] text-gray-700 group-hover:text-primary font-medium transition-colors flex-1">Tất cả sản phẩm</span>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Content - Banners */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Slider */}
              <div className="lg:col-span-2">
                <div className="relative h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl group">
                  {/* Slides with Slide Effect */}
                  {defaultBanners.map((banner, index) => {
                    const isActive = index === currentSlide;
                    const isPrev = index === (currentSlide - 1 + defaultBanners.length) % defaultBanners.length;
                    const isNext = index === (currentSlide + 1) % defaultBanners.length;
                    
                    return (
                      <div
                        key={banner.id}
                        className={cn(
                          'absolute inset-0 transition-all duration-700 ease-out',
                          isActive && 'opacity-100 z-10 translate-x-0',
                          isPrev && 'opacity-0 z-0 -translate-x-full',
                          isNext && 'opacity-0 z-0 translate-x-full',
                          !isActive && !isPrev && !isNext && 'opacity-0 z-0'
                        )}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${banner.image})` }}
                        />
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        {/* Content */}
                        <div className="relative h-full flex items-start p-7 pt-9">
                          <div className={cn(
                            "max-w-md text-white transition-all duration-700",
                            isActive ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                          )}>
                            {banner.highlight && (
                              <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold mb-3 transition-all duration-500 delay-100",
                                isActive ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                                banner.highlight === 'BEST SELLER' && "bg-gradient-to-r from-amber-400 to-orange-500",
                                banner.highlight === 'ĐẶC SẢN' && "bg-gradient-to-r from-red-500 to-pink-500",
                                banner.highlight === 'MỚI VỀ' && "bg-gradient-to-r from-green-400 to-emerald-500",
                                banner.highlight === 'HOT DEAL' && "bg-gradient-to-r from-red-600 to-orange-500"
                              )}>
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                {banner.highlight}
                              </div>
                            )}
                            
                            <h2 className={cn(
                              "text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight transition-all duration-700 delay-150",
                              isActive ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                            )} style={{ textShadow: '2px 4px 20px rgba(0,0,0,0.3)' }}>
                              {banner.title}
                            </h2>
                            
                            {banner.subtitle && (
                              <p className={cn(
                                "text-sm md:text-base mb-4 text-white/90 transition-all duration-700 delay-200",
                                isActive ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                              )} style={{ textShadow: '1px 2px 10px rgba(0,0,0,0.2)' }}>
                                {banner.subtitle}
                              </p>
                            )}

                            {banner.link && (
                              <Link
                                href={banner.link}
                                className={cn(
                                  "inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-semibold text-xs rounded-full transition-all duration-500 delay-300 hover:bg-primary hover:text-white hover:scale-105 hover:shadow-2xl group/btn",
                                  isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                )}
                              >
                                <span>{banner.buttonText || 'Mua ngay'}</span>
                                <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Navigation Arrows */}
                  <button 
                    onClick={() => goToSlide((currentSlide - 1 + defaultBanners.length) % defaultBanners.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/20"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => goToNext()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/20"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Progress Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                    {defaultBanners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="relative"
                      >
                        <div className={cn(
                          'h-2 rounded-full transition-all duration-500 overflow-hidden',
                          index === currentSlide ? 'w-12 bg-white/30' : 'w-2 bg-white/40 hover:bg-white/60'
                        )}>
                          {index === currentSlide && (
                            <div 
                              className="h-full bg-white rounded-full transition-all duration-100"
                              style={{ width: `${progress}%` }}
                            />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Side Banners */}
              <div className="hidden lg:flex flex-col gap-4">
                {sideBanners.map((banner) => (
                  <Link
                    key={banner.id}
                    href={banner.link}
                    className="relative h-[192px] rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-shadow duration-500"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${banner.image})` }}
                    />
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
                    
                    <div className="relative h-full flex flex-col justify-center p-6 text-white">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{banner.icon}</div>
                      <h3 className="text-2xl font-bold mb-1 group-hover:translate-x-1 transition-transform duration-300">{banner.title}</h3>
                      <p className="text-sm text-white/80 group-hover:translate-x-1 transition-transform duration-300 delay-75">{banner.subtitle}</p>
                      
                      <div className="absolute right-6 bottom-6 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {bottomBanners.map((banner) => (
                <Link
                  key={banner.id}
                  href={banner.link}
                  className="relative h-[140px] rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${banner.image})` }}
                  />
                  <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="relative h-full flex items-center justify-between p-6 text-white">
                    <div className="group-hover:translate-x-2 transition-transform duration-300">
                      <h3 className="text-2xl md:text-3xl font-bold mb-1">{banner.title}</h3>
                      <p className="text-sm text-white/80">{banner.subtitle}</p>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-lg group-hover:scale-105 transition-transform duration-300",
                      banner.badge === 'HOT' && "bg-gradient-to-r from-red-500 to-orange-500",
                      banner.badge === 'SALE' && "bg-gradient-to-r from-green-500 to-emerald-500"
                    )}>
                      <span>{banner.badge}</span>
                      <span className="text-white/90">MUA NGAY</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
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
