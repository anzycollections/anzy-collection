import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "image";
  const file = await request.blob();
  const blob = await put(filename, file, { access: "public" });
  return NextResponse.json(blob);
}