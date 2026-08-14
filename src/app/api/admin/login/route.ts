import { NextResponse } from "next/server";
import { createSessionToken, ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from "@/lib/adminSession";

// POST /api/admin/login : vérifie l'identifiant + mot de passe et ouvre une
// session (cookie signé, httpOnly). Volontairement PUBLIC dans le middleware
// (sinon impossible de se connecter la première fois).
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPassword) {
      console.error("ADMIN_USER ou ADMIN_PASSWORD manquant côté serveur.");
      return NextResponse.json(
        { error: "Configuration serveur incomplète. Contacte le support technique." },
        { status: 500 }
      );
    }

    if (username !== adminUser || password !== adminPassword) {
      return NextResponse.json({ error: "Identifiant ou mot de passe incorrect." }, { status: 401 });
    }

    const token = await createSessionToken();
    if (!token) {
      console.error("ADMIN_SESSION_SECRET manquant côté serveur.");
      return NextResponse.json(
        { error: "Configuration serveur incomplète. Contacte le support technique." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error("Erreur POST /api/admin/login:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
