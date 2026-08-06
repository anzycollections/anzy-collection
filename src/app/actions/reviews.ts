"use server";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Récupérer les avis approuvés pour un produit spécifique
export async function getApprovedReviews(productId: string) {
  try {
    const list = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
    
    return list.filter(r => r.isApproved);
  } catch (error) {
    console.error("Erreur chargement avis:", error);
    return [];
  }
}

// 2. Ajouter un nouvel avis (par défaut isApproved = false pour modération)
export async function createReview(data: {
  productId: string;
  author: string;
  rating: number;
  comment: string;
}) {
  try {
    const newId = "rev_" + Date.now();
    await db.insert(reviews).values({
      id: newId,
      productId: data.productId,
      author: data.author,
      rating: data.rating,
      comment: data.comment,
      isApproved: false, // En attente dans l'admin
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur création avis:", error);
    return { success: false, error: "Erreur lors de l'envoi" };
  }
}

// 3. (Pour l'Admin) Récupérer TOUS les avis pour modération
export async function getAllReviewsForAdmin() {
  try {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error("Erreur admin avis:", error);
    return [];
  }
}

// 4. (Pour l'Admin) Valider un avis
export async function toggleApproveReview(reviewId: string, currentStatus: boolean) {
  try {
    await db
      .update(reviews)
      .set({ isApproved: !currentStatus })
      .where(eq(reviews.id, reviewId));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 5. (Pour l'Admin) Supprimer un avis
export async function deleteReview(reviewId: string) {
  try {
    await db.delete(reviews).where(eq(reviews.id, reviewId));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}