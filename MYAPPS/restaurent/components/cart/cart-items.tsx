"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function CartItems() {
  const { items, removeItem, updateQuantity } = useCart();

  if (!items.length) {
    return (
      <Card>
        <CardContent className="pt-5 text-muted-foreground">
          Your cart is empty. Add your favorite dishes from the menu.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center">
            <div className="relative h-20 w-full overflow-hidden rounded-md sm:w-28">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(item.price)} each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
