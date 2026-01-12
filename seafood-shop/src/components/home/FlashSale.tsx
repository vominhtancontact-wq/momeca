'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FlashSale as FlashSaleType, Product } from '@/types';
import { getFlashSales } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import CountdownTimer from '@/components/ui/CountdownTimer';
import Badge from '@/components/ui/Badge';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/stores/authStore';

const MIN_TIER_FOR_FLASH_SALE = 500000; // Chi tiêu tối thiểu để xem Flash Sale

export default function FlashSale() {
  const [flashSale, setFlashSale] = useState<FlashSaleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTotalSpent, setUserTotalSpent] = useState<number | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch flash sales
        const response = await getFlashSales();
        if (response.success && response.data && response.data.length > 0) {
          setFlashSale(response.data[0]);
        }

        // Fetch user spending if authenticated
        if (isAuthenticated) {
          // Get token from zustand persisted storage
          const authStorage = localStorage.getItem('auth-storage');
          let token = null;
          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            token = parsed.state?.token;
          }
          
          if (token) {
            const couponRes = await fetch('/api/coupons', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const couponData = await couponRes.json();
            if (couponData.success) {
              setUserTotalSpent(couponData.data.totalSpent || 0);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-error/5">
        <div className="container mx-auto px-4">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6" />
          <ProductGridSkeleton count={5} />
        </div>
      </section>
    );
  }

  if (!flashSale) {
    return null;
  }

  // Nếu user đã đăng nhập nhưng chưa đủ chi tiêu, hiển thị thông báo
  if (isAuthenticated && userTotalSpent !== null && userTotalSpent < MIN_TIER_FOR_FLASH_SALE) {
    const remaining = MIN_TIER_FOR_FLASH_SALE - userTotalSpent;
    return (
      <section className="py-8 md:py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-orange-100">
            <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Flash Sale dành cho thành viên VIP
            </h2>
            <p className="text-gray-600 mb-4">
              Chi tiêu thêm <span className="font-bold text-primary">{formatPrice(remaining)}</span> để mở khóa Flash Sale độc quyền!
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Đã chi tiêu: {formatPrice(userTotalSpent)}</span>
                <span>Mục tiêu: {formatPrice(MIN_TIER_FOR_FLASH_SALE)}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                  style={{ width: `${(userTotalSpent / MIN_TIER_FOR_FLASH_SALE) * 100}%` }}
                />
              </div>
            </div>
            <Link 
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const calculateDiscount = (originalPrice: number, salePrice: number) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  return (
    <section className="py-8 md:py-12 bg-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-secondary">
              ⚡ {flashSale.name || 'Flash Sale'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Kết thúc trong:</span>
              <CountdownTimer endTime={flashSale.endTime} />
            </div>
          </div>
          <Link
            href="/flash-sale"
            className="text-error hover:text-error/80 font-medium text-sm md:text-base"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Flash Sale Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {flashSale.products.slice(0, 15).map((item) => {
            const product = item.product as Product;
            const discount = calculateDiscount(item.originalPrice, item.salePrice);
            const soldPercent = Math.min(100, Math.round((item.soldCount / item.quantity) * 100));

            return (
              <Link
                key={product._id}
                href={`/san-pham/${product.slug}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      🦐
                    </div>
                  )}

                  {/* Discount Badge */}
                  <Badge variant="discount" className="absolute top-2 left-2">
                    -{discount}%
                  </Badge>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 line-clamp-2 text-sm min-h-[40px]">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-error">
                      {formatPrice(item.salePrice)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="h-4 bg-error/20 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-error rounded-full transition-all duration-300"
                        style={{ width: `${soldPercent}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        Đã bán {item.soldCount}/{item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
