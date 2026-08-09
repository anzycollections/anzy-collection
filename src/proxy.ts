import { NextRequest, NextResponse } from "next/server";

/**
 * Protection de l'espace d'administration.
 *
 * Avant cette correction, /admin ainsi que toutes les routes API permettant
 * de modifier des données (produits, contenu du site, images, consultation
 * des commandes) étaient accessibles publiquement : n'importe quel visiteur
 * connaissant ou devinant l'URL /admin pouvait supprimer des produits,
 * modifier le contenu du site ou consulter les commandes clients.
 *
 * Ce middleware exige un identifiant + mot de passe (Basic Auth) définis
 * via les variables d'environnement ADMIN_USER et ADMIN_PASSWORD.
 *
 * Restent volontairement PUBLICS (nécessaires au fonctionnement normal
 * de la boutique) :
 *  - GET  /api/products, GET /api/content  → affichage de la boutique
 *  - POST /api/orders                       → une cliente doit pouvoir passer commande
 *  - POST /api/upload/receipt               → une cliente doit pouvoir joindre son reçu de paiement
 */

function isAuthorized(req: NextRequest): boolean {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Si les identifiants ne sont pas configurés, on bloque par sécurité
  // plutôt que de laisser l'accès ouvert.
  if (!adminUser || !adminPassword) return false;

  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Basic ")) return false;

  try {
    const decoded = atob(header.split(" ")[1]);
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);
    return user === adminUser && pass === adminPassword;
  } catch {
    return false;
  }
}

function unauthorizedResponse() {
  return new NextResponse("Authentification requise", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Anzy Collection Admin"' },
  });
}

// ⚠️ PROTECTION TEMPORAIREMENT DÉSACTIVÉE ⚠️
// Le temps de finaliser le site (upload produits, tests admin, etc.),
// /admin et les routes d'écriture sont accessibles sans mot de passe.
// Pour RÉACTIVER la protection : repasse cette valeur à false.
const AUTH_TEMPORARILY_DISABLED = true;

export function proxy(req: NextRequest) {
  if (AUTH_TEMPORARILY_DISABLED) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  const isAdminPage = pathname.startsWith("/admin");

  // Consultation des commandes (GET) : réservée à l'admin.
  const isOrdersRead = pathname.startsWith("/api/orders") && method === "GET";

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

  if (!isAuthorized(req)) {
    return unauthorizedResponse();
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
