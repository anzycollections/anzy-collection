"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getShippingOptionsForCountry, ShippingOption, DEFAULT_SHIPPING_PRICES } from "@/data/shippingZones";
import { useStore } from "@/context/StoreContext";

export interface CartItem {
  productId: string;
  productName: string;
  varianteId: string;
  varianteName: string;
  price: number;
  quantity: number;
  image: string;
  id?: string;
  name?: string;
}

export interface CartContextType {
  items: CartItem[];
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, varianteId: string) => void;
  updateQuantity: (productId: string, varianteId: string, quantity: number) => void;
  clearCart: () => void;
  country: string;
  setCountry: (country: string) => void;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;
  setSelectedShipping: (option: ShippingOption) => void;
  subtotal: number;
  shippingCost: number;
  total: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { content } = useStore();
  
  // Initialisation paresseuse depuis localStorage
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("anzy-cart");
    if (saved) setItems(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("anzy-cart", JSON.stringify(items));
  }, [items, isLoaded]);

  const [country, setCountry] = useState<string>("Bénin");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  useEffect(() => {
    const customPrices = (content as any)?.shippingPrices || DEFAULT_SHIPPING_PRICES;
    const options = getShippingOptionsForCountry(country, customPrices);
    setShippingOptions(options);
    if (options.length > 0) {
      setSelectedShipping((prev) => options.find(o => o.id === prev?.id) || options[0]);
    }
  }, [country, (content as any)?.shippingPrices]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(i => i.productId === newItem.productId && i.varianteId === newItem.varianteId);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, varianteId: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.varianteId === varianteId)));
  };

  const updateQuantity = (productId: string, varianteId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, varianteId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.productId === productId && i.varianteId === varianteId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider value={{ items, cart: items, addToCart, removeFromCart, updateQuantity, clearCart, country, setCountry, shippingOptions, selectedShipping, setSelectedShipping, subtotal, shippingCost, total, totalPrice: total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé avec CartProvider");
  return context;
}
