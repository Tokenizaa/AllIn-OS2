import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useStoreCart(routeSlug?: string) {
  const [cart, setCart] = useState<{ product: any; quantity: number }[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`cart_retail_${routeSlug || "default"}`);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const saveCart = (newCart: { product: any; quantity: number }[]) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`cart_retail_${routeSlug || "default"}`, JSON.stringify(newCart));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const addToCart = (prod: any) => {
    const existing = cart.find(item => item.product.id === prod.id);
    let updated;
    if (existing) {
      updated = cart.map(item => item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updated = [...cart, { product: prod, quantity: 1 }];
    }
    saveCart(updated);
    toast.success(`${prod.name} adicionado ao seu carrinho.`);
  };

  const removeFromCart = (prodId: string) => {
    const updated = cart.filter(item => item.product.id !== prodId);
    saveCart(updated);
  };

  const updateQty = (prodId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.product.id === prodId) {
        const nQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => saveCart([]);

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    subtotal,
  };
}
