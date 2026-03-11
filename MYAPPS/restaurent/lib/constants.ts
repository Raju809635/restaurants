import { Category, OrderStatus } from "@prisma/client";

export const categoryLabels: Record<Category, string> = {
  BREAKFAST: "Breakfast",
  MEALS: "Meals",
  SNACKS: "Snacks"
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled"
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/cart", label: "Order" },
  { href: "/contact", label: "Contact" }
];
