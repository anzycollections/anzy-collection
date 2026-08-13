import { NextResponse } from "next/server";
import { db } from "@/db"; // ton instance drizzle-orm/neon-http
import { products } from "@/db/schema";
import { translateProducts } from "@/lib/translate";

// Convertit une ligne de la table "products" (colonne categoryId) vers
// le format attendu par le front (champ "category").
function formatProduct(row: typeof products.$inferSelect) {
  return {
    ...row,
    category: row.categoryId || "",
    price: Number(row.price),
  };
}

// GET /api/products?lang=EN : Récupérer tous les produits pour la Vitrine & Admin
// (traduits automatiquement si "lang" est fourni et différent de "FR")
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "FR";
    const allProducts = await db.select().from(products);
    const formatted = allProducts.map(formatProduct);
    const translated = await translateProducts(formatted, lang);
    return NextResponse.json(translated);
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
