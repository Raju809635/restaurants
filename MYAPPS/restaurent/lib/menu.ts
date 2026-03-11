import { type Category } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

type MenuLike = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: Category;
};

const fallbackMenu: MenuLike[] = [
  {
    id: "fallback-idli",
    name: "Idli Sambar",
    description: "Soft idlis served with hot sambar and coconut chutney.",
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80",
    price: 89,
    category: "BREAKFAST"
  },
  {
    id: "fallback-pesarattu",
    name: "Pesarattu",
    description: "Green gram dosa with ginger chutney.",
    image:
      "https://images.unsplash.com/photo-1701579231307-c81ce9fe36b3?auto=format&fit=crop&w=1200&q=80",
    price: 119,
    category: "BREAKFAST"
  },
  {
    id: "fallback-andhra-meals",
    name: "Andhra Meals",
    description: "Rice, pappu, curry, sambar, rasam, and pickle.",
    image:
      "https://images.unsplash.com/photo-1701579231211-0f2772f32f31?auto=format&fit=crop&w=1200&q=80",
    price: 179,
    category: "MEALS"
  },
  {
    id: "fallback-gongura",
    name: "Gongura Chicken Meal",
    description: "Spicy gongura chicken with steamed rice.",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80",
    price: 249,
    category: "MEALS"
  },
  {
    id: "fallback-punugulu",
    name: "Punugulu",
    description: "Crispy snack balls served with peanut chutney.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    price: 99,
    category: "SNACKS"
  },
  {
    id: "fallback-mirchi",
    name: "Mirchi Bajji",
    description: "Andhra style stuffed chilli fritters.",
    image:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=1200&q=80",
    price: 109,
    category: "SNACKS"
  }
];

function fallbackByCategory(category?: Category) {
  if (!category) return fallbackMenu;
  return fallbackMenu.filter((item) => item.category === category);
}

export async function getMenuItems(category?: Category) {
  if (!process.env.DATABASE_URL) {
    return fallbackByCategory(category);
  }

  try {
    return await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        ...(category ? { category } : {})
      },
      orderBy: [{ category: "asc" }, { createdAt: "desc" }]
    });
  } catch {
    return fallbackByCategory(category);
  }
}

export async function getFeaturedItems() {
  if (!process.env.DATABASE_URL) {
    return fallbackMenu.slice(0, 3);
  }

  try {
    return await prisma.menuItem.findMany({
      where: { isAvailable: true },
      take: 3,
      orderBy: { createdAt: "asc" }
    });
  } catch {
    return fallbackMenu.slice(0, 3);
  }
}
