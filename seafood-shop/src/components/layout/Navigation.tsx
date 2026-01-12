'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Static navigation links
const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/san-pham', label: 'Sản phẩm' },
  { href: '/kien-thuc-hai-san', label: 'Kiến thức hải sản' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="hidden lg:block bg-gradient-to-r from-primary via-primary to-primary-dark shadow-lg relative overflow-hidden">
      {/* Decorative wave pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,30 Q300,60 600,30 T1200,30 V60 H0 Z" fill="white"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <ul className="flex items-center justify-center gap-0 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "relative px-6 py-4 text-white font-medium transition-all duration-300 flex items-center gap-2 group whitespace-nowrap",
                  isActive(link.href) 
                    ? "bg-white/20" 
                    : "hover:bg-white/10"
                )}
              >
                <span>{link.label}</span>
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-accent"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
