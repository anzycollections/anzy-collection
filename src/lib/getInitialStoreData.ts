import { db } from "@/db";
import { products as productsTable, categories as categoriesTable, siteContent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_SHIPPING_PRICES } from "@/data/shippingZones";
import type { Product, Category, StoreContent } from "@/context/StoreContext";

/**
 * Charge produits, catégories et contenu du site directement depuis la base,
 * côté serveur (dans un Server Component). Utilisé par le layout racine pour
 * que la boutique affiche déjà ses produits dans le HTML initial, au lieu
 * d'afficher une coquille vide le temps qu'un fetch se déclenche côté client.
 *
 * En cas d'échec (ex: base momentanément indisponible), on renvoie des
 * tableaux/objets vides : StoreContext prendra alors le relais avec son
 * chargement client habituel (refreshAll), exactement comme avant cette
 * optimisation.
 */
export async function getInitialStoreData(): Promise<{
  products: Product[];
  categories: Category[];
  content: StoreContent;
}> {
  try {
    const [dbProducts, dbCategories, dbContent] = await Promise.all([
      db.select().from(productsTable),
      db.select().from(categoriesTable),
      db.select().from(siteContent).where(eq(siteContent.key, "main_config")).limit(1),
    ]);

    const formattedProducts: Product[] = dbProducts.map((p) => ({
      ...p,
      category: p.categoryId || "",
      price: Number(p.price),
      image: (p.images as string[] | null)?.[0] || "",
      sizes: (p.sizes as string[]) || [],
      colors: (p.colors as { name: string; hex: string }[]) || [],
      images: (p.images as string[]) || [],
      options: (p.options as Product["options"]) || [],
      variantes: (p.variantes as Product["variantes"]) || [],
    }));

    const config = dbContent[0];

    return {
      products: formattedProducts,
      categories: dbCategories.length > 0 ? dbCategories : [],
      content: {
        hero: (config?.hero as StoreContent["hero"]) || {},
        about: (config?.about as StoreContent["about"]) || {},
        footer: (config?.footer as StoreContent["footer"]) || {},
        social: (config?.social as StoreContent["social"]) || {},
        shippingPrices: DEFAULT_SHIPPING_PRICES,
      },
    };
  } catch (error) {
    console.error("Erreur chargement initial (SSR) :", error);
    return { products: [], categories: [], content: {} };
  }
}
