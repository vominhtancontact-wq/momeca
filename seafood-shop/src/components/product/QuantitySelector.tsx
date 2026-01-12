'use client';

import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  size = 'md',
  className
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    if (value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  const sizes = {
    sm: {
      button: 'w-7 h-7 text-sm',
      input: 'w-10 h-7 text-sm'
    },
    md: {
      button: 'w-9 h-9 text-base',
      input: 'w-14 h-9 text-base'
    },
    lg: {
      button: 'w-11 h-11 text-lg',
      input: 'w-16 h-11 text-lg'
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className={cn(
          'flex items-center justify-center rounded-l-lg border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
          sizes[size].button
        )}
        aria-label="Giảm số lượng"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className={cn(
          'border-t border-b border-gray-300 text-center focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          sizes[size].input
        )}
        aria-label="Số lượng"
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={cn(
          'flex items-center justify-center rounded-r-lg border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
          sizes[size].button
        )}
        aria-label="Tăng số lượng"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
