"use client";

import { useState } from "react";

import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";

type AddToCartButtonProps = {
  item: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
};

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      onClick={() => {
        addItem(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      variant={added ? "secondary" : "default"}
      className="w-full"
    >
      {added ? "Added" : "Add to cart"}
    </Button>
  );
}
