"use client";

import { useState } from "react";

import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm() {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  async function onCheckout(formData: FormData) {
    if (!items.length) return;

    setLoading(true);
    try {
      const payload = {
        items,
        deliveryAddress: formData.get("deliveryAddress"),
        phone: formData.get("phone"),
        notes: formData.get("notes")
      };

      const response = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();
      clearCart();
      window.location.href = data.url;
    } catch (error) {
      alert("Unable to checkout. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onCheckout} className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="mb-4 font-display text-2xl">Checkout</p>

        <div className="space-y-3">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" required placeholder="+91 9XXXXXXXXX" />
          </div>
          <div>
            <Label htmlFor="deliveryAddress">Delivery Address</Label>
            <Textarea id="deliveryAddress" name="deliveryAddress" required />
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" placeholder="Less spicy, extra chutney..." />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="font-semibold text-primary">{formatCurrency(total)}</p>
        </div>
      </div>

      <Button disabled={loading || !items.length} className="w-full" size="lg">
        {loading ? "Processing..." : "Pay with Stripe"}
      </Button>
    </form>
  );
}
