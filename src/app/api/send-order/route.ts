import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  
  // Log la commande (en attendant Resend ou autre service email)
  console.log("📦 Nouvelle commande:", JSON.stringify(body, null, 2));
  
  // TODO: Intégrer Resend (gratuit 100 emails/jour) ou SendGrid
  
  return NextResponse.json({ success: true, message: "Commande enregistrée" });
}
