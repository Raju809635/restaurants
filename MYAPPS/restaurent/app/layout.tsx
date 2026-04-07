import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: {
    default: "Chinnamma Ruchulu | South Indian Cloud Kitchen",
    template: "%s | Chinnamma Ruchulu"
  },
  description:
    "Authentic South Indian cloud kitchen in Hyderabad. Fresh breakfast, meals, and snacks with fast online ordering.",
  keywords: [
    "South Indian food",
    "cloud kitchen",
    "Hyderabad restaurant",
    "online food order"
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Chinnamma Ruchulu",
    description: "Traditional flavors, modern ordering experience.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="page-shell container py-8 md:py-10">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
