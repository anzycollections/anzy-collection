import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 });
    }

    // Supprime le fichier directement sur Vercel Blob
    await del(url);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}