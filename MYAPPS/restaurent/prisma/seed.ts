import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin12345", 10);

  await prisma.user.upsert({
    where: { email: "admin@chinnammaruchulu.com" },
    update: {},
    create: {
      name: "Chinnamma Admin",
      email: "admin@chinnammaruchulu.com",
      password: adminPassword,
      role: "ADMIN"
    }
  });

  const menuItems: Prisma.MenuItemCreateManyInput[] = [
    {
      name: "Idli Sambar",
      description: "Soft idlis served with hot sambar and coconut chutney.",
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80",
      price: 89,
      category: "BREAKFAST"
    },
    {
      name: "Pesarattu",
      description: "Green gram dosa with ginger chutney.",
      image: "https://images.unsplash.com/photo-1701579231307-c81ce9fe36b3?auto=format&fit=crop&w=1200&q=80",
      price: 119,
      category: "BREAKFAST"
    },
    {
      name: "Andhra Meals",
      description: "Rice, pappu, curry, sambar, rasam, and pickle.",
      image: "https://images.unsplash.com/photo-1701579231211-0f2772f32f31?auto=format&fit=crop&w=1200&q=80",
      price: 179,
      category: "MEALS"
    },
    {
      name: "Gongura Chicken Meal",
      description: "Spicy gongura chicken with steamed rice.",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80",
      price: 249,
      category: "MEALS"
    },
    {
      name: "Punugulu",
      description: "Crispy snack balls served with peanut chutney.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
      price: 99,
      category: "SNACKS"
    },
    {
      name: "Mirchi Bajji",
      description: "Andhra style stuffed chilli fritters.",
      image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=1200&q=80",
      price: 109,
      category: "SNACKS"
    }
  ];

  await prisma.menuItem.deleteMany();
  await prisma.menuItem.createMany({ data: menuItems });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
