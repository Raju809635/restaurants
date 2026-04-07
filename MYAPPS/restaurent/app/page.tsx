import type { Metadata } from "next";

import { HomeExperience } from "@/components/home/HomeExperience";
import { getFeaturedItems } from "@/lib/menu";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home"
};

export default async function HomePage() {
  const featured = await getFeaturedItems();

  return (
    <HomeExperience
      featured={featured.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        price: Number(item.price)
      }))}
    />
  );
}
