import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '@/modules/auth';
import { cartService, CartItem as SupabaseCartItem } from '@/services/cartService';

// Tipo para item do carrinho (legado para compatibilidade)
export type CartItem = {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: string;
  quantity: number;
  selectedSize?: string;
};

// Tipo para o contexto do carrinho
type CartContextType = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: string, selectedSize?: string) => Promise<void>;
  updateQuantity: (cartItemId: string, selectedSizeOrQuantity: string | number, quantity?: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

// Criar contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Cart Provider
 * MIGRATED: Now uses Supabase cart_items table as single source of truth
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from Supabase when user changes
  useEffect(() => {
    if (!user?.id) {
      setItems([]);
      return;
    }

    const loadCart = async () => {
      setLoading(true);
      try {
        const supabaseItems = await cartService.getCartItems(user.id);
        const mappedItems: CartItem[] = supabaseItems.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.product?.name || 'Produto',
          imageUrl: item.product?.images?.[0] || '',
          price: item.product?.price || '0',
          quantity: item.quantity,
        }));
        setItems(mappedItems);
      } catch (error) {
        console.error('[CartContext] Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user?.id]);

  // Adicionar item ao carrinho
  const addItem = useCallback(async (productId: string, quantity = 1) => {
    if (!user?.id) {
      console.warn('[CartContext] User not logged in, cannot add to cart');
      return;
    }

    setLoading(true);
    try {
      await cartService.addItem(user.id, { product_id: productId, quantity });
      // Reload cart after adding
      const supabaseItems = await cartService.getCartItems(user.id);
      const mappedItems: CartItem[] = supabaseItems.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.product?.name || 'Produto',
        imageUrl: item.product?.images?.[0] || '',
        price: item.product?.price || '0',
        quantity: item.quantity,
      }));
      setItems(mappedItems);
      setIsOpen(true);
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error) {
      console.error('[CartContext] Error adding item to cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Remover item do carrinho
  const removeItem = useCallback(async (cartItemId: string, _selectedSize?: string) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await cartService.removeItem(cartItemId);
      setItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('[CartContext] Error removing item from cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Atualizar quantidade
  const updateQuantity = useCallback(async (cartItemId: string, selectedSizeOrQuantity: string | number, quantity?: number) => {
    if (!user?.id) return;
    const nextQuantity = typeof selectedSizeOrQuantity === "number" ? selectedSizeOrQuantity : (quantity ?? 1);

    setLoading(true);
    try {
      await cartService.updateItemQuantity(cartItemId, nextQuantity);
      setItems(prev =>
        prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: nextQuantity } : item
        )
      );
    } catch (error) {
      console.error('[CartContext] Error updating cart item quantity:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Limpar carrinho
  const clearCart = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await cartService.clearCart(user.id);
      setItems([]);
    } catch (error) {
      console.error('[CartContext] Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Calcular total de itens
  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  // Calcular preço total
  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  }, [items]);

  const contextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      loading,
      isOpen,
      setIsOpen,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice, loading, isOpen]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar o contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.warn('CartProvider not found, returning empty cart.');
    return {
      items: [],
      addItem: async () => console.warn('CartProvider not found'),
      removeItem: async () => console.warn('CartProvider not found'),
      updateQuantity: async () => console.warn('CartProvider not found'),
      clearCart: async () => console.warn('CartProvider not found'),
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
      loading: false,
      isOpen: false,
      setIsOpen: () => console.warn('CartProvider not found'),
    };
  }
  return context;
};
