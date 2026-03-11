import type { Metadata } from "next";

import { MenuGrid } from "@/components/menu/menu-grid";
import { Section } from "@/components/shared/section";
import { getMenuItems } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse the breakfast, meals, and snacks menu from Chinnamma Ruchulu."
};

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <Section
      title="Online Menu"
      subtitle="From soft idlis to spicy gongura meals, order your South Indian favorites instantly."
    >
      <MenuGrid
        items={items.map((item) => ({
          ...item,
          price: Number(item.price)
        }))}
      />
    </Section>
  );
}
