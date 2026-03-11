"use client";

import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";

import { CartProvider } from "@/components/cart/cart-context";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
