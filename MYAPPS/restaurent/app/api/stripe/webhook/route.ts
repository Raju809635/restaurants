import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook config missing" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" }
      });
    }
  }

  return NextResponse.json({ received: true });
}
