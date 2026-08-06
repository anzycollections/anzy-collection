import { NextResponse } from "next/server";
import { db } from "@/db"; // ton instance drizzle-orm/neon-http
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/products : Récupérer tous les produits pour la Vitrine & Admin
export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Erreur GET /api/products:", error);
    return NextResponse.json({ error: "Erreur serveur DB" }, { status: 500 });
  }
}

// POST /api/products : Ajouter un produit dans Neon DB
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Génération d'un ID si non fourni
    const newProduct = {
      ...body,
      id: body.id || `prod_${Date.now()}`,
      price: String(body.price), // decimal Drizzle attend une chaîne ou number compatible
    };

    await db.insert(products).values(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/products:", error);
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 });
  }
}