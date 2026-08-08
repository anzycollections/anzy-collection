import { NextResponse } from "next/server";
import { db } from "@/db"; // Assure-toi que ce chemin correspond à ton export de DB
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET /api/orders : Liste des commandes pour l'admin (protégé par middleware)
export async function GET() {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Erreur GET /api/orders:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la lecture des commandes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.customer?.name || !body?.customer?.phone || !Array.isArray(body?.items)) {
      return NextResponse.json({ error: "Données de commande incomplètes" }, { status: 400 });
    }

    // Insertion dans Neon Postgres via Drizzle
    // Remarque : le formulaire de commande ne rend pas l'email obligatoire,
    // et certains champs de paiement (opérateur, référence) diffèrent selon
    // la méthode choisie (Mobile Money vs Transfert) ; on fournit toujours
    // une valeur pour respecter les colonnes NOT NULL en base.
    const newOrder = await db.insert(orders).values({
      id: crypto.randomUUID(),
      customerName: body.customer.name,
      customerEmail: body.customer.email || "",
      customerPhone: body.customer.phone,
      customerAddress: body.customer.address || "",
      customerCity: body.customer.city || "",
      customerCountry: body.customer.country || "",
      items: body.items,
      shippingMethod: body.shipping?.method || body.shipping?.name || "Standard",
      shippingCost: String(body.shipping?.cost ?? 0),
      paymentMethod: body.payment?.method || "mobile_money",
      paymentOperator: body.payment?.operator || "Mobile Money",
      paymentReference: body.payment?.reference || "Justificatif joint",
      receiptUrl: body.payment?.receiptUrl || "",
      total: String(body.total ?? 0),
      currency: body.currency || "XOF",
      status: "pending",
    }).returning();

    return NextResponse.json({ success: true, orderId: newOrder[0].id });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la commande :", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création de la commande" }, { status: 500 });
  }
}
