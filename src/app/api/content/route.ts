import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteContent } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/content : Récupère la config
export async function GET() {
  try {
    const config = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, "main_config"))
      .limit(1);

    if (config.length === 0) {
      return NextResponse.json({});
    }

    return NextResponse.json(config[0]);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lecture contenu" }, { status: 500 });
  }
}

// POST /api/content : Sauvegarde la config (upsert)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    await db
      .insert(siteContent)
      .values({
        key: "main_config",
        hero: body.hero || {},
        about: body.about || {},
        footer: body.footer || {},
        social: body.social || {},
      })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: {
          hero: body.hero || {},
          about: body.about || {},
          footer: body.footer || {},
          social: body.social || {},
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur POST /api/content:", error);
    return NextResponse.json({ error: "Erreur sauvegarde contenu" }, { status: 500 });
  }
}