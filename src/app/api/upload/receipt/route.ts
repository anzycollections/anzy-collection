import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import sharp from "sharp";

// Route PUBLIQUE (volontairement non protégée par le middleware admin) :
// une cliente doit pouvoir joindre la preuve de son paiement au moment
// de passer commande, avant même d'avoir de compte ou d'accès admin.
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") || `recu_${Date.now()}`;
    const fileBuffer = Buffer.from(await request.arrayBuffer());

    if (fileBuffer.length === 0) {
      return NextResponse.json({ error: "Fichier vide" }, { status: 400 });
    }
    // Limite raisonnable (10 Mo) pour éviter les abus sur une route publique.
    if (fileBuffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux" }, { status: 400 });
    }

    const isGif = filename.toLowerCase().endsWith(".gif");
    let outputBuffer = fileBuffer;
    let finalFilename = `receipts/${filename}`;

    if (!isGif) {
      outputBuffer = await sharp(fileBuffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      finalFilename = `receipts/${filename.replace(/\.[^/.]+$/, "")}.webp`;
    }

    const blob = await put(finalFilename, outputBuffer, { access: "public" });
    return NextResponse.json(blob);
  } catch (error) {
    console.error("Erreur upload reçu:", error);
    return NextResponse.json({ error: "Échec de l'envoi du reçu" }, { status: 500 });
  }
}
