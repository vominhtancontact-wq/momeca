import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductVariant, WeightOption, CartItem } from '@/types';

interface AppliedCoupon {
  code: string;
  discount: number;
}

interface CartStore {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  currentUserId: string | null; // Track current user
  
  // Actions
  addItem: (product: Product, variant?: ProductVariant, weightOption?: WeightOption, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string, weightOptionId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, weightOptionId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  
  // User-specific actions
  switchUser: (userId: string | null) => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getItemQuantity: (productId: string, variantId?: string, weightOptionId?: string) => number;
}

// Helper to get storage key for a user
const getStorageKey = (userId: string | null) => {
  return userId ? `cart-storage-${userId}` : 'cart-storage-guest';
};

// Helper to save cart to localStorage
const saveCartToStorage = (userId: string | null, items: CartItem[], appliedCoupon: AppliedCoupon | null) => {
  if (typeof window === 'undefined') return;
  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify({ items, appliedCoupon }));
};

// Helper to load cart from localStorage
const loadCartFromStorage = (userId: string | null): { items: CartItem[]; appliedCoupon: AppliedCoupon | null } => {
  if (typeof window === 'undefined') return { items: [], appliedCoupon: null };
  const key = getStorageKey(userId);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        items: parsed.items || [],
        appliedCoupon: parsed.appliedCoupon || null,
      };
    } catch {
      return { items: [], appliedCoupon: null };
    }
  }
  return { items: [], appliedCoupon: null };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      currentUserId: null,

      addItem: (product: Product, variant?: ProductVariant, weightOption?: WeightOption, quantity = 1) => {
        const state = get();
        
        // Chặn nếu chưa đăng nhập (currentUserId = null)
        if (!state.currentUserId) {
          console.warn('User must be logged in to add items to cart');
          return;
        }
        
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product._id === product._id &&
              item.variant?._id === variant?._id &&
              item.weightOption?._id === weightOption?._id
          );

          // Calculate final price with weight multiplier
          const basePrice = variant?.price ?? product.price;
          const weightMultiplier = weightOption?.priceMultiplier ?? 1;
          const finalPrice = basePrice * weightMultiplier;

          let newItems: CartItem[];
          if (existingIndex > -1) {
            newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
          } else {
            newItems = [...state.items, { 
              product, 
              variant, 
              weightOption,
              quantity,
              finalPrice
            }];
          }

          // Save to user-specific storage
          saveCartToStorage(state.currentUserId, newItems, state.appliedCoupon);
          
          return { items: newItems };
        });
      },

      removeItem: (productId: string, variantId?: string, weightOptionId?: string) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) =>
              !(item.product._id === productId && 
                item.variant?._id === variantId &&
                item.weightOption?._id === weightOptionId)
          );
          
          // Save to user-specific storage
          saveCartToStorage(state.currentUserId, newItems, state.appliedCoupon);
          
          return { items: newItems };
        });
      },

      updateQuantity: (productId: string, variantId: string | undefined, weightOptionId: string | undefined, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId, weightOptionId);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.product._id === productId && 
            item.variant?._id === variantId &&
            item.weightOption?._id === weightOptionId
              ? { ...item, quantity }
              : item
          );
          
          // Save to user-specific storage
          saveCartToStorage(state.currentUserId, newItems, state.appliedCoupon);
          
          return { items: newItems };
        });
      },

      clearCart: () => {
        const state = get();
        saveCartToStorage(state.currentUserId, [], null);
        set({ items: [], appliedCoupon: null });
      },

      setCoupon: (coupon: AppliedCoupon | null) => {
        set((state) => {
          saveCartToStorage(state.currentUserId, state.items, coupon);
          return { appliedCoupon: coupon };
        });
      },

      // Switch to a different user's cart
      switchUser: (userId: string | null) => {
        const state = get();
        
        // Save current cart before switching
        if (state.currentUserId !== userId) {
          saveCartToStorage(state.currentUserId, state.items, state.appliedCoupon);
        }
        
        // Load the new user's cart
        const { items, appliedCoupon } = loadCartFromStorage(userId);
        
        set({
          currentUserId: userId,
          items,
          appliedCoupon,
        });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((total, item) => {
          const price = item.finalPrice ?? (item.variant?.price ?? item.product.price);
          return total + price * item.quantity;
        }, 0);
      },

      getItemQuantity: (productId: string, variantId?: string, weightOptionId?: string) => {
        const item = get().items.find(
          (item) =>
            item.product._id === productId && 
            item.variant?._id === variantId &&
            item.weightOption?._id === weightOptionId
        );
        return item?.quantity ?? 0;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        currentUserId: state.currentUserId,
      }),
    }
  )
);

import { useState, useEffect } from 'react';

// Hook to check if we're on client side (for SSR compatibility)
export const useCartHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
};
