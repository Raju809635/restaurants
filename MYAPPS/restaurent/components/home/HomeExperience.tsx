"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles, Timer } from "lucide-react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Hero3D } from "@/components/home/Hero3D";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type FeaturedDish = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
};

type HomeExperienceProps = {
  featured: FeaturedDish[];
};

export function HomeExperience({ featured }: HomeExperienceProps) {
  return (
    <div className="-mx-4 pb-14 md:-mx-6 lg:-mx-8">
      <Hero3D />

      <section className="px-4 py-6 md:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 backdrop-blur xl:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Experience Layer</p>
            <p className="font-display text-3xl text-white">Premium visuals, practical ordering.</p>
          </div>
          <div className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <Sparkles className="mt-1 h-5 w-5 text-[#ffb25f]" />
            <div>
              <p className="text-sm font-semibold text-white">Scroll storytelling</p>
              <p className="mt-1 text-sm leading-6 text-white/62">
                The homepage now behaves like a product narrative instead of a static brochure.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <Timer className="mt-1 h-5 w-5 text-[#ffb25f]" />
            <div>
              <p className="text-sm font-semibold text-white">Performance-aware</p>
              <p className="mt-1 text-sm leading-6 text-white/62">
                Devices with reduced-motion or lower-power signals fall back to a premium static hero.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/42">Signature Picks</p>
            <h2 className="font-display text-4xl text-white md:text-5xl">
              Featured dishes presented like hero products.
            </h2>
            <p className="max-w-2xl text-white/62">
              The content stays shoppable, but every card now lives inside the same premium visual language as the 3D hero.
            </p>
          </div>
          <Link href="/menu">
            <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              Browse full menu <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((item, index) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] transition duration-500 hover:-translate-y-1 hover:border-white/20"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.66))]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-black/25 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/60 backdrop-blur">
                  {index === 0 ? "Chef Pick" : index === 1 ? "Best Seller" : "House Special"}
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-white">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">{item.description}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-[#ffbf6d]">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <AddToCartButton
                  item={{
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: item.price
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pt-4 md:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,rgba(255,130,74,0.12),rgba(255,255,255,0.04))] p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Next Layer</p>
            <h2 className="font-display text-4xl text-white">
              The rest of the site is ready for the same visual system.
            </h2>
            <p className="max-w-xl text-white/66">
              Menu browsing, gallery, about, and contact can all inherit this darker premium tone with the same parallax, motion, and product-led composition.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/gallery">
                <Button className="bg-white text-black hover:bg-white/90">Open Gallery</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Visit Contact
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/22 p-5">
              <MapPin className="h-5 w-5 text-[#ffbf6d]" />
              <p className="mt-4 text-sm font-semibold text-white">Cloud kitchen, product-grade presentation</p>
              <p className="mt-2 text-sm leading-6 text-white/58">
                The contact and map sections can carry the same layered lighting, elevated cards, and subtle motion.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/22 p-5">
              <Sparkles className="h-5 w-5 text-[#ffbf6d]" />
              <p className="mt-4 text-sm font-semibold text-white">Optional real GLB swap-in</p>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Drop a polished bowl model into `public/models/food-bowl.glb` and the scene will use it automatically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
