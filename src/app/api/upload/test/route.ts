import { NextResponse } from "next/server";
import { db } from "@/db"; // Adapte le chemin selon ton projet
import { products } from "@/db/schema";

export async function GET() {
  try {
    // Récupérer tous les produits
    const data = await db.select().from(products);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}