import type { Metadata } from "next";
import Image from "next/image";

import { Section } from "@/components/shared/section";

const gallery = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1601050690117-94f5f6fa2503?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80"
];

export const metadata: Metadata = {
  title: "Gallery"
};

export default function GalleryPage() {
  return (
    <Section
      title="Restaurant Gallery"
      subtitle="A visual taste of our signature dishes, prep process, and delivery-ready meals."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((src, index) => (
          <div key={src} className="group relative h-56 overflow-hidden rounded-xl border border-border/60">
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
