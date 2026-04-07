"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useHeroScroll } from "@/components/home/use-hero-scroll";

const Scene = dynamic(
  () => import("@/components/home/Scene").then((mod) => mod.Scene),
  { ssr: false }
);

const storyBeats = [
  {
    step: "01",
    title: "A hero that moves like a plated product film",
    copy:
      "The bowl idles gently, reacts to hover, and shifts perspective as the story unfolds so the first screen feels alive instead of static."
  },
  {
    step: "02",
    title: "Scroll reveals the ingredients and the spice profile",
    copy:
      "As we move down the page, ingredients drift outward, lighting deepens, and the camera eases closer to create a product-story rhythm."
  },
  {
    step: "03",
    title: "The UI stays minimal while the visuals do the selling",
    copy:
      "The content is still clear and fast to scan, but the motion, depth, and dark premium finish give the restaurant a far more elevated presence."
  }
] as const;

const stats = [
  { value: "3D", label: "interactive hero" },
  { value: "60fps", label: "motion target" },
  { value: "Fallback", label: "low-end safe" }
] as const;

function LowPowerFallback() {
  return (
    <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#120d10]">
      <Image
        src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1600&q=80"
        alt="South Indian bowl"
        fill
        priority
        className="object-cover opacity-75"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,6,7,0.1),rgba(8,6,7,0.88))]" />
      <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.28em] text-white/60">Lightweight mode</p>
        <p className="mt-2 max-w-sm text-sm text-white/82">
          A static premium fallback is shown automatically when the device prefers reduced motion or lower graphics load.
        </p>
      </div>
    </div>
  );
}

export function Hero3D() {
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [preferFallback, setPreferFallback] = useState(false);

  useHeroScroll({ rootRef, introRef, stageRef, progressRef });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowPowerDevice =
      mediaQuery.matches ||
      Boolean(connection?.saveData) ||
      navigator.hardwareConcurrency <= 4 ||
      (typeof deviceMemory === "number" && deviceMemory <= 4);

    setPreferFallback(lowPowerDevice);

    const onChange = () => setPreferFallback(true);
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden px-4 pb-20 pt-6 md:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,140,64,0.2),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(255,96,70,0.18),transparent_24%),linear-gradient(180deg,rgba(17,10,11,0.92),rgba(7,5,6,1))]" />
        <div className="absolute left-[-8%] top-[14%] h-64 w-64 rounded-full bg-[#ef7a35]/14 blur-3xl" />
        <div className="absolute bottom-[12%] right-[-10%] h-72 w-72 rounded-full bg-[#ffb45e]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:140px_140px] opacity-25" />
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 pt-6 lg:pt-12">
          <div ref={introRef} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/70 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[#ffb25f]" />
              Cinematic South Indian Dining
            </div>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.92] text-white sm:text-6xl xl:text-7xl">
              Chinnamma Ruchulu, rebuilt as a premium 3D tasting story.
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              We keep the ordering flow practical, but the front of the experience now feels closer to a launch film: lit, layered, and designed to move with the user.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/menu">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#ef7a35] to-[#ffb661] text-black shadow-[0_18px_50px_rgba(239,122,53,0.35)]"
                >
                  Experience the Menu
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  Start an Order <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  data-stat-item
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
                >
                  <p className="font-display text-2xl text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-white/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="relative lg:pt-8">
          <div ref={stageRef} className="lg:sticky lg:top-24">
            <div className="relative h-[440px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d090b] sm:h-[540px] lg:h-[calc(100vh-7rem)]">
              <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(255,194,114,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
              {preferFallback ? <LowPowerFallback /> : <Scene progressRef={progressRef} />}
              <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 rounded-[1.5rem] border border-white/10 bg-black/28 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-white/54">
                  <span>3D dish stage</span>
                  <span>Scroll to reveal</span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ef7a35] to-[#ffca7b]"
                    style={{
                      width: "calc(var(--hero-progress, 0) * 100%)"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">
        {storyBeats.map((beat, index) => (
          <article
            key={beat.step}
            data-story-card
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1"
          >
            <div
              data-card-glow
              className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-[#ef7a35]/12 blur-3xl"
            />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.34em] text-white/45">
                Chapter {beat.step}
              </p>
              <h2 className="mt-4 font-display text-3xl text-white">{beat.title}</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/66 sm:text-base">
                {beat.copy}
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/42">
                <span className="h-px w-10 bg-white/18" />
                {index === 0 ? "Hero" : index === 1 ? "Scroll Motion" : "Minimal UI"}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
