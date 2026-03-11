"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORIES,
  ORDER_STATUSES,
  categoryLabels,
  orderStatusLabels,
  type Category,
  type OrderStatus
} from "@/lib/constants";

type MenuItem = {
  id: string;
  name: string;
  category: Category;
  price: string;
};

type Order = {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  user: {
    name: string | null;
    email: string;
  };
};

type Props = {
  menuItems: MenuItem[];
  orders: Order[];
};

export function AdminPanel({ menuItems, orders }: Props) {
  const [loading, setLoading] = useState(false);

  async function createMenuItem(formData: FormData) {
    setLoading(true);
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image"),
      category: formData.get("category"),
      price: Number(formData.get("price"))
    };

    const response = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);
    if (response.ok) {
      window.location.reload();
    }
  }

  async function updateStatus(orderId: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    window.location.reload();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add Menu Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createMenuItem} className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input name="name" required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea name="description" required />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input name="image" type="url" required />
            </div>
            <div>
              <Label>Price</Label>
              <Input name="price" type="number" min="1" step="0.01" required />
            </div>
            <div>
              <Label>Category</Label>
              <select
                name="category"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                defaultValue="BREAKFAST"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Item"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="rounded-md border border-border/60 p-3 text-sm">
              <p className="font-semibold">{item.name}</p>
              <p className="text-muted-foreground">
                {categoryLabels[item.category]} | INR {item.price}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Manage Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 rounded-md border border-border/60 p-3 text-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">Order #{order.id.slice(-6).toUpperCase()}</p>
                <p className="text-muted-foreground">
                  {order.user.name || "Customer"} ({order.user.email}) | INR {order.totalAmount}
                </p>
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3"
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {orderStatusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
