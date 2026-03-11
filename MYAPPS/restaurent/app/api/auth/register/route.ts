import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const password = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password
    }
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
