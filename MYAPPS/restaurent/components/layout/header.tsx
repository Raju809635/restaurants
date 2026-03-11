"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { CartLink } from "@/components/cart/cart-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl text-primary">
          Chinnamma Ruchulu
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <CartLink />
          {session ? (
            <>
              <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}>
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((prev) => !prev)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-card md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <CartLink />
              {session ? (
                <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                  Logout
                </Button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
