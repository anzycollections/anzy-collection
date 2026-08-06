import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

// Next.js 16 : les paramètres dynamiques sont désormais une Promise, il faut les "await".
type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/products/[id] : Mettre à jour un produit
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Normalisation : le formulaire envoie "category", la colonne en base s'appelle "categoryId"
    const { category, produits, products: _ignored, ...rest } = body;
    const updateData: Record<string, unknown> = { ...rest };

    if (category !== undefined) {
      updateData.categoryId = category;
    }
    if (updateData.price !== undefined) {
      updateData.price = String(updateData.price);
    }
    // On ne laisse jamais un id vide écraser la clé primaire
    delete updateData.id;

    await db.update(products).set(updateData).where(eq(products.id, id));
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Erreur PUT /api/products/[id]:", error);
    return NextResponse.json({ error: "Erreur mise à jour du produit" }, { status: 500 });
  }
}

// DELETE /api/products/[id] : Supprimer un produit
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Erreur DELETE /api/products/[id]:", error);
    return NextResponse.json({ error: "Erreur suppression du produit" }, { status: 500 });
  }
}
