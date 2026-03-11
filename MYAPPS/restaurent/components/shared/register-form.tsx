"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Unable to create account");
      setLoading(false);
      return;
    }

    window.location.href = "/login";
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h1 className="font-display text-3xl">Register</h1>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" minLength={6} required />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Already registered? <Link href="/login" className="text-primary">Login</Link>
      </p>
    </form>
  );
}
