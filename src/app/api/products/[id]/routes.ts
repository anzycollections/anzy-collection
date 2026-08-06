import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

// PUT /api/products/[id] : Mettre à jour un produit
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (body.price !== undefined) {
      body.price = String(body.price);
    }

    await db.update(products).set(body).where(eq(products.id, id));
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Erreur PUT /api/products/[id]:", error);
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }
}

// DELETE /api/products/[id] : Supprimer un produit
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Erreur DELETE /api/products/[id]:", error);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}