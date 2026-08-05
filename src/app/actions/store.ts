"use server";

import { db } from "@/db";
import { products, categories, siteContent } from "@/db/schema";
import { seedInitialData } from "@/db/seed";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getStoreData() {
  try {
    await seedInitialData();

    const dbCategories = await db.select().from(categories);
    const dbProducts = await db.select().from(products);
    const dbContent = await db.select().from(siteContent).where(eq(siteContent.key, "main_config"));

    const rawContent = dbContent[0];

    return {
      categories: dbCategories,
      products: dbProducts.map(p => ({
        id: p.id,
        brand: p.brand,
        name: p.name,
        category: p.categoryId || "", // <-- ALIAS : transforme categoryId en category pour l'UI
        badge: p.badge || "Nouveauté",
        description: p.description || "",
        price: Number(p.price),
        currency: p.currency || "XOF",
        material: p.material || "",
        sizes: (p.sizes as string[]) || [],
        colors: (p.colors as any[]) || [],
        images: (p.images as string[]) || [],
        stock: p.stock,
        visible: p.visible,
        options: (p.options as any[]) || [],
        variantes: (p.variantes as any[]) || [],
      })),
      content: rawContent ? {
        hero: rawContent.hero as any,
        about: rawContent.about as any,
        footer: rawContent.footer as any,
        social: rawContent.social as any,
      } : null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération Neon:", error);
    return null;
  }
}

export async function saveStoreContentAction(newContent: any) {
  try {
    // 1. Sauvegarder les produits
    if (newContent.products) {
      for (const prod of newContent.products) {
        await db.insert(products).values({
          id: prod.id,
          brand: prod.brand,
          name: prod.name,
          categoryId: prod.category, // <-- Sauvegarde le champ 'category' de l'UI vers 'categoryId'
          badge: prod.badge,
          description: prod.description,
          price: prod.price.toString(),
          currency: prod.currency,
          material: prod.material,
          sizes: prod.sizes,
          colors: prod.colors,
          images: prod.images,
          stock: prod.stock,
          visible: prod.visible,
          options: prod.options,
          variantes: prod.variantes,
        }).onConflictDoUpdate({
          target: products.id,
          set: {
            brand: prod.brand,
            name: prod.name,
            categoryId: prod.category,
            badge: prod.badge,
            description: prod.description,
            price: prod.price.toString(),
            stock: prod.stock,
            visible: prod.visible,
            options: prod.options,
            variantes: prod.variantes,
            images: prod.images,
          },
        });
      }
    }

    // 2. Sauvegarder les catégories
    if (newContent.categories) {
      for (const cat of newContent.categories) {
        await db.insert(categories).values({
          id: cat.id,
          name: cat.name,
          visible: cat.visible,
        }).onConflictDoUpdate({
          target: categories.id,
          set: { visible: cat.visible, name: cat.name },
        });
      }
    }

    // 3. Sauvegarder la configuration du site
    if (newContent.hero) {
      await db.insert(siteContent).values({
        key: "main_config",
        hero: newContent.hero,
        about: newContent.about,
        footer: newContent.footer,
        social: newContent.social,
      }).onConflictDoUpdate({
        target: siteContent.key,
        set: {
          hero: newContent.hero,
          about: newContent.about,
          footer: newContent.footer,
          social: newContent.social,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error("Erreur sauvegarde Neon:", err);
    return { success: false };
  }
}