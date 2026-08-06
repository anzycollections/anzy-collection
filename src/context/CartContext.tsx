"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  productName: string;
  varianteId: string;
  varianteName: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, varianteId?: string) => void;
  updateQuantity: (productId: string, quantity: number, varianteId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger le panier sauvegardé au montage
  useEffect(() => {
    const savedCart = localStorage.getItem("anzy_cart_session");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erreur de récupération du panier:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder à chaque modification du panier
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("anzy_cart_session", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === newItem.productId && i.varianteId === newItem.varianteId
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, varianteId?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && (!varianteId || item.varianteId === varianteId)))
    );
  };

  const updateQuantity = (productId: string, quantity: number, varianteId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, varianteId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && (!varianteId || item.varianteId === varianteId)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans CartProvider");
  }
  return context;
}

export default useCart;