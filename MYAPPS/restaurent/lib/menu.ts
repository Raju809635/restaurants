import { Category } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getMenuItems(category?: Category) {
  return prisma.menuItem.findMany({
    where: {
      isAvailable: true,
      ...(category ? { category } : {})
    },
    orderBy: [{ category: "asc" }, { createdAt: "desc" }]
  });
}

export async function getFeaturedItems() {
  return prisma.menuItem.findMany({
    where: { isAvailable: true },
    take: 3,
    orderBy: { createdAt: "asc" }
  });
}
