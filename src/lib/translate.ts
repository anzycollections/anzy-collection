import crypto from "crypto";
import { db } from "@/db";
import { translationCache } from "@/db/schema";
import { inArray } from "drizzle-orm";

const GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2";

function cacheKey(text: string, lang: string): string {
  return crypto.createHash("sha256").update(`${lang}:${text}`).digest("hex");
}

/**
 * Traduit une liste de textes français vers une langue cible, en réutilisant
 * le cache en base pour ne jamais retraduire deux fois le même texte.
 * Renvoie les textes dans le même ordre. Si la langue cible est "FR", ou en
 * cas d'erreur/absence de clé API, renvoie les textes tels quels (le site
 * reste fonctionnel en français plutôt que de planter).
 */
export async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  const lang = (targetLang || "FR").toLowerCase();
  if (lang === "fr" || texts.length === 0) return texts;

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_TRANSLATE_API_KEY manquante — textes renvoyés non traduits");
    return texts;
  }

  const entries = texts.map((text, index) => ({
    index,
    text,
    key: text && text.trim() ? cacheKey(text, lang) : null,
  }));
  const keys = entries.filter((e) => e.key).map((e) => e.key as string);

  const cacheMap = new Map<string, string>();
  if (keys.length > 0) {
    try {
      const cached = await db.select().from(translationCache).where(inArray(translationCache.id, keys));
      cached.forEach((c) => cacheMap.set(c.id, c.translatedText));
    } catch (e) {
      console.error("Erreur lecture cache de traduction:", e);
    }
  }

  const missing = entries.filter((e) => e.key && !cacheMap.has(e.key));

  if (missing.length > 0) {
    try {
      const res = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: missing.map((m) => m.text),
          target: lang,
          source: "fr",
          format: "text",
        }),
      });
      const data = await res.json();
      const translations = data?.data?.translations;

      if (Array.isArray(translations)) {
        const rows = missing.map((m, i) => ({
          id: m.key as string,
          sourceText: m.text,
          targetLang: lang,
          translatedText: translations[i]?.translatedText ?? m.text,
        }));
        rows.forEach((row) => cacheMap.set(row.id, row.translatedText));
        // Sauvegarde en arrière-plan sans bloquer la réponse : si l'écriture
        // échoue (ex: doublon simultané), la traduction a quand même déjà
        // été utilisée, seul le cache sera reconstruit à la prochaine visite.
        db.insert(translationCache).values(rows).onConflictDoNothing().catch((e) => {
          console.error("Erreur écriture cache de traduction:", e);
        });
      } else {
        console.error("Réponse inattendue de Google Translate:", data);
      }
    } catch (e) {
      console.error("Erreur appel Google Translate:", e);
    }
  }

  return entries.map((e) => (e.key ? cacheMap.get(e.key) ?? e.text : e.text));
}

/** Traduit un seul texte (pratique, s'appuie sur translateBatch + son cache). */
export async function translateText(text: string, targetLang: string): Promise<string> {
  const [result] = await translateBatch([text], targetLang);
  return result;
}

/**
 * Traduit les champs texte d'une liste de produits (nom, description, badge,
 * matière) en un seul lot groupé, pour économiser les appels API. Ajoute aussi
 * un dictionnaire `variantLabels` (valeur d'origine -> texte traduit) pour les
 * options/variantes (Couleur, Taille, Rouge, L...), SANS modifier les valeurs
 * d'origine elles-mêmes : la sélection, le rapprochement de variante et les
 * couleurs (colorMap) continuent de fonctionner sur le texte français d'origine,
 * seul l'affichage change. Fonctionne automatiquement pour tout produit ajouté
 * plus tard, sans code supplémentaire.
 */
export async function translateProducts<T extends Record<string, any>>(
  products: T[],
  targetLang: string
): Promise<T[]> {
  if ((targetLang || "FR").toUpperCase() === "FR" || products.length === 0) return products;

  const fields = ["name", "description", "badge", "material"] as const;
  const texts: string[] = [];
  const map: { productIndex: number; field: string }[] = [];

  products.forEach((p, productIndex) => {
    fields.forEach((field) => {
      if (typeof p[field] === "string" && p[field]) {
        map.push({ productIndex, field });
        texts.push(p[field]);
      }
    });
  });

  const translated = await translateBatch(texts, targetLang);
  const result = products.map((p) => ({ ...p }));
  map.forEach((m, i) => {
    (result[m.productIndex] as any)[m.field] = translated[i];
  });

  // --- Libellés de variantes/options (Couleur, Taille, Rouge, L...) ---
  // On ne modifie jamais les valeurs d'origine (utilisées pour la sélection
  // et le colorMap) : on construit juste un dictionnaire "valeur -> traduction"
  // que le front utilise uniquement pour l'affichage.
  const labelSet = new Set<string>();
  products.forEach((p: any) => {
    (p.options || []).forEach((opt: any) => {
      if (opt?.name) labelSet.add(opt.name);
      (opt?.values || []).forEach((v: string) => v && labelSet.add(v));
    });
    (p.variantes || []).forEach((v: any) => {
      if (v?.name) labelSet.add(v.name);
      if (v?.title) labelSet.add(v.title);
      if (v?.combo) {
        Object.entries(v.combo).forEach(([key, val]) => {
          if (key) labelSet.add(key);
          if (val) labelSet.add(String(val));
        });
      }
    });
  });

  if (labelSet.size > 0) {
    const labelList = Array.from(labelSet);
    const translatedLabels = await translateBatch(labelList, targetLang);
    const labelMap: Record<string, string> = {};
    labelList.forEach((l, i) => {
      labelMap[l] = translatedLabels[i];
    });
    result.forEach((p: any) => {
      p.variantLabels = labelMap;
    });
  }

  return result;
}

/**
 * Traduit le contenu éditable du site (hero, à propos, pied de page,
 * lookbook, catégories) en un seul lot groupé. Fonctionne automatiquement
 * pour tout texte ajouté ou modifié plus tard depuis l'admin.
 */
export async function translateSiteContent<T extends Record<string, any>>(
  content: T,
  targetLang: string
): Promise<T> {
  if ((targetLang || "FR").toUpperCase() === "FR") return content;

  const result: any = JSON.parse(JSON.stringify(content ?? {}));
  const texts: string[] = [];
  const setters: ((value: string) => void)[] = [];

  const addField = (obj: any, field: string) => {
    if (obj && typeof obj[field] === "string" && obj[field]) {
      texts.push(obj[field]);
      setters.push((v) => {
        obj[field] = v;
      });
    }
  };

  addField(result.hero, "badge");
  addField(result.hero, "title");
  addField(result.hero, "subtitle");
  addField(result.hero, "buttonText");

  addField(result.about, "subtitle");
  addField(result.about, "title");
  addField(result.about, "founderRole"); // founderName volontairement exclu (nom propre)
  addField(result.about, "quote");
  addField(result.about, "description");

  addField(result.footer, "copyright");
  (result.footer?.links || []).forEach((l: any) => addField(l, "label"));

  (result.lookbook || []).forEach((item: any) => {
    addField(item, "title");
    addField(item, "subtitle");
  });

  (result.categories || []).forEach((cat: any) => addField(cat, "name"));

  const translated = await translateBatch(texts, targetLang);
  translated.forEach((v, i) => setters[i](v));

  return result;
}
