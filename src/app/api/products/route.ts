import { NextResponse } from "next/server";
import { db } from "@/db"; // ton instance drizzle-orm/neon-http
import { products } from "@/db/schema";

// Convertit une ligne de la table "products" (colonne categoryId) vers
// le format attendu par le front (champ "category").
function formatProduct(row: typeof products.$inferSelect) {
  return {
    ...row,
    category: row.categoryId || "",
    price: Number(row.price),
  };
}

// GET /api/products : Récupérer tous les produits pour la Vitrine & Admin
export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts.map(formatProduct));
  } catch (error) {
    console.error("Erreur GET /api/products:", error);
    return NextResponse.json({ error: "Erreur serveur DB" }, { status: 500 });
  }
}

// POST /api/products : Ajouter un produit dans Neon DB
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, produits, products: _ignored, ...rest } = body;

    // Génération d'un ID si non fourni + mapping category -> categoryId (colonne réelle en base)
    const newProduct = {
      ...rest,
      id: body.id || `prod_${Date.now()}`,
      categoryId: category || body.categoryId || null,
      price: String(body.price ?? 0), // decimal Drizzle attend une chaîne
    };

    const [inserted] = await db.insert(products).values(newProduct).returning();
    return NextResponse.json(formatProduct(inserted), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/products:", error);
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 });
  }
}
