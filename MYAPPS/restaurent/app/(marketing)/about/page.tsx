import type { Metadata } from "next";
import Image from "next/image";

import { Section } from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <Section
      title="About Chinnamma Ruchulu"
      subtitle="A family-inspired cloud kitchen serving traditional Andhra comfort food with consistent quality."
    >
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="relative h-[380px]">
            <Image
              src="https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=1400&q=80"
              alt="South Indian cooking"
              fill
              className="object-cover"
            />
          </div>
        </Card>
        <Card>
          <CardContent className="space-y-4 pt-5 text-muted-foreground">
            <p>
              Chinnamma Ruchulu was built to bring homestyle Telugu flavors to busy city life. Every recipe is grounded in regional methods, from tempering techniques to spice combinations.
            </p>
            <p>
              As a cloud kitchen, we focus on hygiene, consistency, and quick delivery. We prepare in small batches across breakfast, lunch meals, and evening snacks.
            </p>
            <p>
              Whether you are craving classic meals or spicy snacks, we deliver warmth and flavor in every order.
            </p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
