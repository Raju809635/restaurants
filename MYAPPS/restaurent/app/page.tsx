import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeaturedItems } from "@/lib/menu";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home"
};

export default async function HomePage() {
  const featured = await getFeaturedItems();

  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <Badge className="bg-accent">Hyderabad Cloud Kitchen</Badge>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Warm, Homestyle <span className="text-primary">South Indian</span> Meals Delivered Fast
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Chinnamma Ruchulu serves authentic Andhra breakfast, meals, and evening snacks with modern online ordering.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/menu">
              <Button size="lg">Explore Menu</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" size="lg">
                Order Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[380px] overflow-hidden rounded-2xl border border-border/50">
          <Image
            src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1600&q=80"
            alt="South Indian thali"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute bottom-5 left-5 rounded-xl bg-black/50 p-4 backdrop-blur">
            <p className="font-display text-lg">Authentic Andhra Spice</p>
            <p className="text-sm text-neutral-200">Freshly prepared every day</p>
          </div>
        </div>
      </section>

      <Section
        title="Featured Dishes"
        subtitle="Customer favorites prepared with pure oils, traditional masalas, and home-style techniques."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-44">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  {item.name}
                  <span className="text-base text-primary">{formatCurrency(Number(item.price))}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <AddToCartButton
                  item={{
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: Number(item.price)
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Why Chinnamma Ruchulu"
        subtitle="Built for comfort food lovers who want quality and speed."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {["Traditional Andhra recipes", "Fast cloud-kitchen delivery", "Fresh batches made every day"].map((point) => (
            <Card key={point}>
              <CardContent className="flex items-center gap-3 pt-5">
                <Flame className="h-5 w-5 text-primary" />
                <p>{point}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
