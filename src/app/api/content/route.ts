import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteContent, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/content : Récupère la config (hero, about, footer, social) + les catégories
export async function GET() {
  try {
    const [config, allCategories] = await Promise.all([
      db.select().from(siteContent).where(eq(siteContent.key, "main_config")).limit(1),
      db.select().from(categories),
    ]);

    const base = config[0] || {};

    return NextResponse.json({
      ...base,
      categories: allCategories,
    });
  } catch (error) {
    console.error("Erreur GET /api/content:", error);
    return NextResponse.json({ error: "Erreur lecture contenu" }, { status: 500 });
  }
}

// POST /api/content : Sauvegarde la config (upsert) + les catégories si fournies
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Sauvegarde des catégories (visibilité / nom), si présentes dans la requête
    if (Array.isArray(body.categories)) {
      for (const cat of body.categories) {
        if (!cat?.id) continue;
        await db
          .insert(categories)
          .values({ id: cat.id, name: cat.name, visible: cat.visible })
          .onConflictDoUpdate({
            target: categories.id,
            set: { name: cat.name, visible: cat.visible },
          });
      }
    }

    // 2. Sauvegarde du contenu (hero / about / footer / social) seulement si fourni,
    // pour ne jamais écraser une section avec un objet vide par erreur.
    const hasSiteContentFields = body.hero || body.about || body.footer || body.social || body.lookbook || body.shippingPrices;
    if (hasSiteContentFields) {
      const existing = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, "main_config"))
        .limit(1);
      const current = existing[0];

      const merged = {
        hero: body.hero ?? current?.hero ?? {},
        about: body.about ?? current?.about ?? {},
        footer: body.footer ?? current?.footer ?? {},
        social: body.social ?? current?.social ?? {},
        lookbook: body.lookbook ?? current?.lookbook ?? [],
        shippingPrices: body.shippingPrices ?? current?.shippingPrices ?? {},
      };

      await db
        .insert(siteContent)
        .values({ key: "main_config", ...merged })
        .onConflictDoUpdate({
          target: siteContent.key,
          set: { ...merged, updatedAt: new Date() },
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur POST /api/content:", error);
    return NextResponse.json({ error: "Erreur sauvegarde contenu" }, { status: 500 });
  }
}
