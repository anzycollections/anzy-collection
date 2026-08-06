import { NextResponse } from "next/server";
import { db } from "@/db"; // Assure-toi que ce chemin correspond à ton export de DB
import { orders } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Insertion dans Neon Postgres via Drizzle
    const newOrder = await db.insert(orders).values({
      id: crypto.randomUUID(),
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      customerAddress: body.customer.address,
      customerCity: body.customer.city,
      customerCountry: body.customer.country,
      items: body.items,
      shippingMethod: body.shipping.method,
      shippingCost: body.shipping.cost.toString(),
      paymentMethod: body.payment.method,
      paymentOperator: body.payment.operator,
      paymentReference: body.payment.reference,
      receiptUrl: body.payment.receiptUrl,
      total: body.total.toString(),
      currency: body.currency,
      status: "pending",
    }).returning();

    return NextResponse.json({ success: true, orderId: newOrder[0].id });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la commande :", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création de la commande" }, { status: 500 });
  }
}
