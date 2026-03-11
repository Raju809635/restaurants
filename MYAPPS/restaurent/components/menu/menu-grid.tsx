"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES, categoryLabels, type Category } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: Category;
};

type MenuGridProps = {
  items: MenuItem[];
};

const categories: (Category | "ALL")[] = ["ALL", ...CATEGORIES];

export function MenuGrid({ items }: MenuGridProps) {
  const [category, setCategory] = useState<Category | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (category === "ALL") return items;
    return items.filter((item) => item.category === category);
  }, [items, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((value) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              category === value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {value === "ALL" ? "All" : categoryLabels[value]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">{item.name}</CardTitle>
                <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
              </div>
              <Badge>{categoryLabels[item.category]}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <AddToCartButton
                item={{
                  id: item.id,
                  name: item.name,
                  image: item.image,
                  price: item.price
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
