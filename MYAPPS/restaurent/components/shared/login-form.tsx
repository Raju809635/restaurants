"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/dashboard",
      redirect: false
    });

    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    window.location.href = result?.url || "/dashboard";
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h1 className="font-display text-3xl">Login</h1>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <p className="text-sm text-muted-foreground">
        New user? <Link href="/register" className="text-primary">Create account</Link>
      </p>
    </form>
  );
}
