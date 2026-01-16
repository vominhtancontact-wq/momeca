'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

interface ProductSuggestion {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export default function SearchBar({ 
  placeholder = 'Tìm kiếm hải sản...', 
  className 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions khi query thay đổi
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/suggestions?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Click outside để đóng suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setQuery('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div ref={wrapperRef} className={`relative ${className || ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-5 pr-14 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 text-gray-700 placeholder:text-gray-400 shadow-sm hover:shadow-md hover:border-gray-200"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-95"
            aria-label="Tìm kiếm"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/50 z-50 max-h-96 overflow-y-auto animate-slide-down">
          <div className="p-2">
            {suggestions.map((product, index) => (
              <Link
                key={product._id}
                href={`/san-pham/${product.slug}`}
                onClick={handleSuggestionClick}
                className="flex items-center gap-4 p-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent rounded-xl transition-all duration-300 group/item"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-14 h-14 relative flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-sm group-hover/item:shadow-md transition-shadow">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                      sizes="56px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate group-hover/item:text-primary transition-colors">{product.name}</p>
                  <p className="text-sm font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">{formatPrice(product.price)}</p>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          
          {/* Xem tất cả kết quả */}
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => {
                setShowSuggestions(false);
                router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
              }}
              className="w-full p-3 text-center text-sm text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <span>Xem tất cả kết quả cho "{query}"</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* No results */}
      {showSuggestions && query.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/50 z-50 p-6 text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Không tìm thấy sản phẩm phù hợp</p>
          <p className="text-gray-400 text-xs mt-1">Thử tìm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
}
