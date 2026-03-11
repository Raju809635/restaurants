import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { orderStatusLabels, type OrderStatus } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-200",
  PAID: "bg-blue-500/20 text-blue-200",
  PREPARING: "bg-orange-500/20 text-orange-200",
  OUT_FOR_DELIVERY: "bg-purple-500/20 text-purple-200",
  DELIVERED: "bg-emerald-500/20 text-emerald-200",
  CANCELLED: "bg-red-500/20 text-red-200"
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { menuItem: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <Section
      title="User Dashboard"
      subtitle="Track current and previous orders from Chinnamma Ruchulu."
    >
      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-5 text-muted-foreground">
              No orders yet. Start from the menu and place your first order.
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-xl">Order #{order.id.slice(-6).toUpperCase()}</CardTitle>
                <Badge className={statusStyles[order.status as OrderStatus]}>
                  {orderStatusLabels[order.status as OrderStatus]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Total: <span className="font-semibold text-primary">{formatCurrency(Number(order.totalAmount))}</span>
                </p>
                <p>Placed: {order.createdAt.toLocaleString("en-IN")}</p>
                <div className="rounded-md bg-background/50 p-3">
                  {order.items.map((item) => (
                    <p key={item.id}>
                      {item.menuItem.name} x {item.quantity}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Section>
  );
}
