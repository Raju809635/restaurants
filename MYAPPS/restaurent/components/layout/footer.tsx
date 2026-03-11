import Link from "next/link";
import { PhoneCall } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60">
      <div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Chinnamma Ruchulu. Crafted for authentic South Indian flavors.</p>
        <div className="flex items-center gap-4">
          <Link href="/contact">Contact</Link>
          <a href="tel:+919999999999" className="inline-flex items-center gap-1">
            <PhoneCall className="h-4 w-4" /> +91 99999 99999
          </a>
        </div>
      </div>
    </footer>
  );
}
