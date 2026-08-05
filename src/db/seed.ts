import { db } from "./index";
import { categories, siteContent } from "./schema";

export async function seedInitialData() {
  // 1. Initialiser les catégories si vides
  const existingCats = await db.select().from(categories);
  if (existingCats.length === 0) {
    await db.insert(categories).values([
      { id: "protheses", name: "Prothèses", visible: true },
      { id: "gaines", name: "Gaines", visible: true },
      { id: "fesses", name: "Fesses en Chiffon", visible: true },
      { id: "vetements", name: "Vêtements", visible: true },
      { id: "huiles", name: "Huiles Essentielles", visible: true },
      { id: "thes", name: "Thés & Infusions", visible: true },
      { id: "skincare", name: "Skincare", visible: true },
    ]);
  }

  // 2. Initialiser le contenu par défaut
  const existingContent = await db.select().from(siteContent);
  if (existingContent.length === 0) {
    await db.insert(siteContent).values({
      key: "main_config",
      hero: { title: "EMPOWER YOUR BEAUTY", subtitle: "Découvrez notre collection.", cta: "Découvrir la Collection", images: [], badge: "Nouvelle Saison 2026" },
      about: { title: "L'élégance à la française", subtitle: "Notre Histoire", paragraph1: "Fondée par Helena Mcneil.", paragraph2: "Chaque pièce sublime la femme moderne.", image: "", stats: [] },
      footer: { copyright: "© 2026 Anzy Collection.", links: [] },
      social: { instagram: "", tiktok: "", facebook: "" },
    });
  }
}