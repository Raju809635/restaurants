"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

type SectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
        {subtitle ? <p className="max-w-2xl text-muted-foreground">{subtitle}</p> : null}
      </motion.div>
      {children}
    </section>
  );
}
