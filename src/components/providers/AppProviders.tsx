"use client";

import React from "react";
import { StoreProvider } from "@/context/StoreContext";
import { CartProvider } from "@/context/CartContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </StoreProvider>
  );
}
