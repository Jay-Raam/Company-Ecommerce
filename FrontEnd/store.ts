import { create } from 'zustand';
import { CartItem, Product, User } from './types';

interface AppState {
  // Cart State
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // User State
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  
  // UI State
  isCartOpen: boolean;
  toggleCart: (isOpen: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  cart: [],
  user: null,
  isCartOpen: false,

  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    cart: state.cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter(item => item.quantity > 0)
  })),

  clearCart: () => set({ cart: [] }),

  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  
  toggleCart: (isOpen) => set({ isCartOpen: isOpen })
}));