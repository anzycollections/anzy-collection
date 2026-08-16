import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProductById(id: string) {
  try {
    const rows = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("Erreur getProductById :", error);
    return null;
  }
}
