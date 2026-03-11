import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AdminPanel } from "@/components/dashboard/admin-panel";
import { Section } from "@/components/shared/section";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [menuItems, orders] = await Promise.all([
    prisma.menuItem.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <Section title="Admin Dashboard" subtitle="Manage menu catalog and incoming orders.">
      <AdminPanel
        menuItems={menuItems.map((item) => ({
          ...item,
          price: item.price.toString()
        }))}
        orders={orders.map((order) => ({
          ...order,
          totalAmount: order.totalAmount.toString()
        }))}
      />
    </Section>
  );
}
