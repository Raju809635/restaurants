import type { Metadata } from "next";

import { CartItems } from "@/components/cart/cart-items";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { Section } from "@/components/shared/section";

export const metadata: Metadata = {
  title: "Order Cart"
};

export default function CartPage() {
  return (
    <Section
      title="Order / Cart"
      subtitle="Review items, confirm delivery details, and place your order securely."
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <CartItems />
        <CheckoutForm />
      </div>
    </Section>
  );
}
