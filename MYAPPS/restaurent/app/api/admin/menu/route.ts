import { Category } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  image: z.string().url(),
  price: z.number().positive(),
  category: z.nativeEnum(Category)
});

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = await prisma.menuItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const item = await prisma.menuItem.create({
    data: parsed.data
  });

  return NextResponse.json(item, { status: 201 });
}
