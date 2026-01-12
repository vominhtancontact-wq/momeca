'use client';

import { useEffect, useState } from 'react';
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

// Category images mapping (placeholder - can be replaced with actual images)
const categoryImages: Record<string, string> = {
  'cua': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop',
  'tom': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop',
  'ca': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
  'oc-so': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop',
  'muc-bach-tuoc': 'https://images.unsplash.com/photo-1545816250-e12bedba42ba?w=400&h=300&fit=crop',
  'combo': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=300&fit=crop',
  'default': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop'
};

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-b from-background to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-background to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            <span className="text-primary">Danh Mục</span> Sản Phẩm
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các loại hải sản tươi ngon được tuyển chọn kỹ lưỡng
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-12 h-1 bg-primary rounded-full"></span>
            <span className="w-3 h-3 bg-accent rounded-full"></span>
            <span className="w-12 h-1 bg-primary rounded-full"></span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const icon = categoryIcons[category.slug] || categoryIcons['default'];
            const image = category.image || categoryImages[category.slug] || categoryImages['default'];
            
            return (
              <Link
                key={category._id}
                href={`/danh-muc/${category.slug}`}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={cn(
                  "relative aspect-square rounded-2xl overflow-hidden transition-all duration-500",
                  "shadow-lg hover:shadow-2xl",
                  hoveredIndex === index ? "scale-105 z-10" : "scale-100"
                )}>
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent group-hover:from-primary/95 transition-all duration-300"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white">
                    {/* Icon */}
                    <div className={cn(
                      "w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 transition-all duration-300",
                      "group-hover:bg-accent group-hover:scale-110"
                    )}>
                      <span className="text-2xl md:text-3xl">{icon}</span>
                    </div>
                    
                    {/* Name */}
                    <h3 className="font-bold text-lg md:text-xl text-center drop-shadow-lg">
                      {category.name}
                    </h3>
                    
                    {/* View More - appears on hover */}
                    <div className={cn(
                      "flex items-center gap-1 text-sm mt-2 transition-all duration-300",
                      hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    )}>
                      <span>Xem thêm</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg group-hover:border-accent transition-colors duration-300"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Xem tất cả sản phẩm</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
