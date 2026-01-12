'use client';

import { ProductVariant } from '@/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onVariantSelect: (variant: ProductVariant) => void;
  className?: string;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onVariantSelect,
  className
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">
        Chọn loại:
      </label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant?._id === variant._id;
          const isOutOfStock = !variant.inStock;

          return (
            <button
              key={variant._id}
              type="button"
              onClick={() => !isOutOfStock && onVariantSelect(variant)}
              disabled={isOutOfStock}
              className={cn(
                'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300',
                isOutOfStock && 'opacity-50 cursor-not-allowed line-through'
              )}
            >
              <span className="block">{variant.name}</span>
              <span className={cn(
                'block text-xs mt-0.5',
                isSelected ? 'text-primary' : 'text-gray-500'
              )}>
                {formatPrice(variant.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
