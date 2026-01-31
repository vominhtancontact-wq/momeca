// Product Types
export interface ProductVariant {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface WeightOption {
  _id?: string;
  name: string;
  weight: number;
  priceMultiplier: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  category: Category | string;
  variants?: ProductVariant[];
  weightOptions?: WeightOption[];
  soldCount: number;
  inStock: boolean;
  tags?: string[];
  unit?: string;
  isBestSeller?: boolean;
  isHotDeal?: boolean;
  isCombo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Cart Types
export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  weightOption?: WeightOption;
  quantity: number;
  finalPrice?: number; // Price after applying weight multiplier
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Order Types
export interface OrderItem {
  product: string;
  productName: string;
  productImage?: string;
  variant?: string;
  variantName?: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerNote?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  items: OrderItem[];
  subtotal?: number;
  couponCode?: string;
  couponDiscount?: number;
  shippingFee?: number;
  totalAmount: number;
  paymentMethod?: 'cod' | 'online';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
}

// Flash Sale Types
export interface FlashSaleProduct {
  product: string | Product;
  salePrice: number;
  originalPrice: number;
  quantity: number;
  soldCount: number;
}

export interface FlashSale {
  _id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  products: FlashSaleProduct[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API Request Types
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  search?: string;
}

export interface CreateOrderDTO {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerNote?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  paymentMethod?: 'cod' | 'online';
  couponCode?: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
}

// UI Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
  inStock?: boolean;
}
