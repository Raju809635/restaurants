"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";

export function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
      aria-label="Cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
