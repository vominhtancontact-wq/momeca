import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'discount' | 'variant' | 'outOfStock' | 'success' | 'warning' | 'info';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    discount: 'bg-error text-white',
    variant: 'bg-primary text-white',
    outOfStock: 'bg-gray-500 text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-gray-900',
    info: 'bg-accent text-white'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
