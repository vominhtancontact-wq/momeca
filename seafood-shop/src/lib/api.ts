import { Product, Category, Order, FlashSale, PaginatedResponse, ApiResponse, ProductQueryParams, CreateOrderDTO } from '@/types';

const API_BASE = '/api';

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include', // Gửi cookies kèm theo request
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Đã có lỗi xảy ra');
  }

  return data;
}

// Products API
export async function getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.minPrice) searchParams.set('minPrice', params.minPrice.toString());
  if (params?.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
  if (params?.category) searchParams.set('category', params.category);

  const query = searchParams.toString();
  return fetchApi<PaginatedResponse<Product>>(`/products${query ? `?${query}` : ''}`);
}

export async function getProduct(idOrSlug: string): Promise<ApiResponse<Product>> {
  return fetchApi<ApiResponse<Product>>(`/products/${idOrSlug}`);
}

export async function getProductsByCategory(
  slug: string,
  params?: ProductQueryParams
): Promise<PaginatedResponse<Product> & { category: Category }> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.minPrice) searchParams.set('minPrice', params.minPrice.toString());
  if (params?.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());

  const query = searchParams.toString();
  return fetchApi<PaginatedResponse<Product> & { category: Category }>(
    `/products/category/${slug}${query ? `?${query}` : ''}`
  );
}

export async function searchProducts(
  query: string,
  page = 1,
  limit = 12
): Promise<PaginatedResponse<Product> & { query: string }> {
  const searchParams = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString()
  });

  return fetchApi<PaginatedResponse<Product> & { query: string }>(
    `/products/search?${searchParams.toString()}`
  );
}

// Categories API
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return fetchApi<ApiResponse<Category[]>>('/categories');
}

// Orders API
export async function createOrder(orderData: CreateOrderDTO): Promise<ApiResponse<Order>> {
  return fetchApi<ApiResponse<Order>>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function getOrderByPhone(phone: string): Promise<PaginatedResponse<Order>> {
  return fetchApi<PaginatedResponse<Order>>(`/orders?phone=${phone}`);
}

// Flash Sales API
export async function getFlashSales(): Promise<ApiResponse<FlashSale[]>> {
  return fetchApi<ApiResponse<FlashSale[]>>('/flash-sales');
}

// Best sellers - get products marked as best seller
export async function getBestSellers(limit = 15): Promise<PaginatedResponse<Product>> {
  return fetchApi<PaginatedResponse<Product>>(`/products/best-sellers?limit=${limit}`);
}

// Hot deals - get products marked as hot deal
export async function getHotDeals(limit = 10): Promise<PaginatedResponse<Product>> {
  return fetchApi<PaginatedResponse<Product>>(`/products/hot-deals?limit=${limit}`);
}

// Server-side fetch functions với caching
export async function getBestSellersServer(limit = 15): Promise<PaginatedResponse<Product>> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/products/best-sellers?limit=${limit}`, {
    next: { revalidate: 60 } // Cache 60 giây
  });
  return response.json();
}

export async function getHotDealsServer(limit = 15): Promise<PaginatedResponse<Product>> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/products/hot-deals?limit=${limit}`, {
    next: { revalidate: 60 } // Cache 60 giây
  });
  return response.json();
}
