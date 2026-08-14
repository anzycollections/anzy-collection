import { NextResponse } from "next/server";
import { UI_STRINGS } from "@/i18n/uiStrings";
import { translateBatch } from "@/lib/translate";

// GET /api/ui-strings?lang=EN : traduit les textes fixes de l'interface
// (boutons, libellés...) et renvoie un dictionnaire {clé: texte traduit}.
// Utilise le même cache que le reste du site (translation_cache), donc
// chaque texte n'est traduit qu'une seule fois pour tous les visiteurs.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "FR";

    if (lang.toUpperCase() === "FR") {
      return NextResponse.json(UI_STRINGS);
    }

    const keys = Object.keys(UI_STRINGS);
    const values = keys.map((k) => UI_STRINGS[k]);
    const translated = await translateBatch(values, lang);

    const result: Record<string, string> = {};
    keys.forEach((k, i) => {
      result[k] = translated[i] || UI_STRINGS[k];
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur GET /api/ui-strings:", error);
    // En cas de souci, on renvoie le français plutôt que de casser l'affichage.
    return NextResponse.json(UI_STRINGS);
  }
}
