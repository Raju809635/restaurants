"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const message = encodeURIComponent("Hi Chinnamma Ruchulu, I want to place an order.");
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-green-600"
    >
      <MessageCircle className="h-4 w-4" /> WhatsApp Order
    </a>
  );
}
