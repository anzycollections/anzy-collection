import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";

/**
 * Protection de l'espace d'administration.
 *
 * L'admin se connecte via une vraie page (/admin/login), qui pose un cookie
 * de session signé (voir src/lib/adminSession.ts) — plus de popup Basic Auth
 * du navigateur, qui pouvait être fermée par erreur.
 *
 * Restent volontairement PUBLICS (nécessaires au fonctionnement normal
 * de la boutique) :
 *  - GET  /api/products, GET /api/content  → affichage de la boutique
 *  - POST /api/orders                       → une cliente doit pouvoir passer commande
 *  - POST /api/upload/receipt               → une cliente doit pouvoir joindre son reçu de paiement
 *  - /admin/login, POST /api/admin/login    → il faut pouvoir se connecter la première fois
 */

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  // La page de connexion elle-même doit rester accessible sans être connecté
  // (sinon impossible de se connecter la première fois).
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");

  // Consultation ET mise à jour des commandes : réservées à l'admin.
  // (POST reste public : c'est ainsi qu'une cliente enregistre sa commande)
  const isOrdersRead = pathname.startsWith("/api/orders") && method !== "POST";

  // Écriture sur les produits / contenu du site : réservée à l'admin.
  const isProductsWrite = pathname.startsWith("/api/products") && method !== "GET";
  const isContentWrite = pathname.startsWith("/api/content") && method !== "GET";

  // Upload/suppression d'images liées aux produits : réservé à l'admin.
  // (le reçu de paiement client passe par /api/upload/receipt, non concerné ici)
  const isAdminUpload =
    (pathname === "/api/upload" || pathname.startsWith("/api/upload/delete")) &&
    method !== "GET";

  const needsAuth = isAdminPage || isOrdersRead || isProductsWrite || isContentWrite || isAdminUpload;

  if (!needsAuth) {
    return NextResponse.next();
  }

  const authorized = await isAuthorized(req);
  if (!authorized) {
    if (isAdminPage) {
      // Page consultée directement dans le navigateur → on renvoie vers la
      // page de connexion, en gardant en mémoire où l'utilisatrice voulait aller.
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Appel API (fetch depuis le panneau admin) → réponse JSON, pas de redirection.
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/orders/:path*",
    "/api/products/:path*",
    "/api/content/:path*",
    "/api/upload",
    "/api/upload/delete/:path*",
  ],
};
