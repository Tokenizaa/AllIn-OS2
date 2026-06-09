import { supabase } from '../lib/supabase-client';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Product details joined
  product?: {
    id: string;
    name: string;
    price: string;
    images: string[];
    category: string | null;
  };
}

export interface CartItemInput {
  product_id: string;
  quantity: number;
  metadata?: Record<string, any>;
}

/**
 * Cart Service
 * MIGRATED: Now uses Supabase cart_items table as single source of truth
 */
export const cartService = {
  /**
   * Get all cart items for current user
   */
  getCartItems: async (userId: string): Promise<CartItem[]> => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          images,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[cartService] Error fetching cart items:', error);
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: item.quantity,
      metadata: item.metadata || {},
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: item.products,
    }));
  },

  /**
   * Add item to cart
   */
  addItem: async (userId: string, item: CartItemInput): Promise<CartItem> => {
    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', item.product_id)
      .single();

    if (existing) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existing.quantity + item.quantity,
          metadata: { ...existing.metadata, ...item.metadata }
        })
        .eq('id', existing.id)
        .select(`
          *,
          products (
            id,
            name,
            price,
            images,
            category
          )
        `)
        .single();

      if (error) {
        console.error('[cartService] Error updating cart item:', error);
        throw error;
      }

      return {
        id: data.id,
        user_id: data.user_id,
        product_id: data.product_id,
        quantity: data.quantity,
        metadata: data.metadata || {},
        created_at: data.created_at,
        updated_at: data.updated_at,
        product: data.products,
      };
    }

    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: item.product_id,
        quantity: item.quantity,
        metadata: item.metadata || {},
      })
      .select(`
        *,
        products (
          id,
          name,
          price,
          images,
          category
        )
      `)
      .single();

    if (error) {
      console.error('[cartService] Error adding cart item:', error);
      throw error;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      product_id: data.product_id,
      quantity: data.quantity,
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at,
      product: data.products,
    };
  },

  /**
   * Update item quantity
   */
  updateItemQuantity: async (cartItemId: string, quantity: number): Promise<void> => {
    if (quantity <= 0) {
      await cartService.removeItem(cartItemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    if (error) {
      console.error('[cartService] Error updating cart item quantity:', error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   */
  removeItem: async (cartItemId: string): Promise<void> => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error('[cartService] Error removing cart item:', error);
      throw error;
    }
  },

  /**
   * Clear all cart items for user
   */
  clearCart: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('[cartService] Error clearing cart:', error);
      throw error;
    }
  },

  /**
   * Get cart total
   */
  getCartTotal: async (userId: string): Promise<number> => {
    const items = await cartService.getCartItems(userId);
    return items.reduce((total, item) => {
      const price = parseFloat(item.product?.price || '0');
      return total + (price * item.quantity);
    }, 0);
  },

  /**
   * Get cart item count
   */
  getCartItemCount: async (userId: string): Promise<number> => {
    const items = await cartService.getCartItems(userId);
    return items.reduce((count, item) => count + item.quantity, 0);
  },
};
