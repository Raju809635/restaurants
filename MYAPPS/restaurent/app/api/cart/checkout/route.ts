import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const schema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string().url(),
      quantity: z.number().int().positive(),
      price: z.number().positive()
    })
  ),
  deliveryAddress: z.string().min(10),
  phone: z.string().min(8),
  notes: z.string().optional()
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success || parsed.data.items.length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const total = parsed.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      totalAmount: total,
      deliveryAddress: parsed.data.deliveryAddress,
      phone: parsed.data.phone,
      notes: parsed.data.notes,
      items: {
        create: parsed.data.items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  });

  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?paid=1`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cart?cancelled=1`;

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: parsed.data.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    })),
    metadata: {
      orderId: order.id
    },
    success_url: successUrl,
    cancel_url: cancelUrl
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      stripeSessionId: checkoutSession.id
    }
  });

  return NextResponse.json({ url: checkoutSession.url });
}

