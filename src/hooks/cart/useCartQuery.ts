import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth";
import { cartService, CartItem as SupabaseCartItem } from "@/services/cartService";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: string;
  quantity: number;
  selectedSize?: string;
};

// Sprint 2: Migrar CartProvider para TanStack Query
async function fetchCartItems(userId: string): Promise<CartItem[]> {
  const supabaseItems = await cartService.getCartItems(userId);
  return supabaseItems.map(item => ({
    id: item.id,
    productId: item.product_id,
    name: item.product?.name || 'Produto',
    imageUrl: item.product?.images?.[0] || '',
    price: item.product?.price || '0',
    quantity: item.quantity,
  }));
}

export function useCartQuery() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => fetchCartItems(user?.id || ""),
    enabled: !!user?.id,
    staleTime: 0, // Sempre atualizar
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (!user?.id) throw new Error("User not logged in");
      await cartService.addItem(user.id, { product_id: productId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      await cartService.removeItem(cartItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      await cartService.updateItemQuantity(cartItemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not logged in");
      await cartService.clearCart(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const addItem = async (productId: string, quantity = 1) => {
    await addItemMutation.mutateAsync({ productId, quantity });
  };

  const removeItem = async (cartItemId: string, _selectedSize?: string) => {
    await removeItemMutation.mutateAsync(cartItemId);
  };

  const updateQuantity = async (cartItemId: string, selectedSizeOrQuantity: string | number, quantity?: number) => {
    const nextQuantity = typeof selectedSizeOrQuantity === "number" ? selectedSizeOrQuantity : (quantity ?? 1);
    await updateQuantityMutation.mutateAsync({ cartItemId, quantity: nextQuantity });
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  const getTotalItems = () => {
    return query.data?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getTotalPrice = () => {
    return query.data?.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0) || 0;
  };

  return {
    items: query.data || [],
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    loading: query.isLoading || addItemMutation.isPending || removeItemMutation.isPending || updateQuantityMutation.isPending || clearCartMutation.isPending,
    error: query.error,
  };
}

// Hook combinado para compatibilidade com código existente
// Inclui estado de UI (isOpen) que permanece local
export function useCart() {
  const cartQuery = useCartQuery();
  const [isOpen, setIsOpen] = useState(false);

  return {
    ...cartQuery,
    isOpen,
    setIsOpen,
  };
}
