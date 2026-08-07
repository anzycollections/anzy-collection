import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "image";
  const fileBuffer = Buffer.from(await request.arrayBuffer());

  const isGif = filename.toLowerCase().endsWith(".gif");

  let outputBuffer = fileBuffer;
  let finalFilename = filename;

  if (!isGif) {
    // Redimensionne (max 1600px de large) et convertit en WebP
    outputBuffer = await sharp(fileBuffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Remplace l'extension par .webp
    finalFilename = filename.replace(/\.[^/.]+$/, "") + ".webp";
  }

  const blob = await put(finalFilename, outputBuffer, { access: "public" });
  return NextResponse.json(blob);
}