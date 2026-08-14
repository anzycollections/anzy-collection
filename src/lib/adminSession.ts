// Gestion de la session admin via un cookie signé (HMAC-SHA256).
// Utilise l'API Web Crypto (crypto.subtle), disponible à la fois dans le
// middleware (Edge) et dans les routes API (Node) — donc pas besoin du
// module "crypto" de Node, qui ne fonctionne pas dans le middleware.

const encoder = new TextEncoder();
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 jours

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Crée un jeton de session valable 30 jours (null si ADMIN_SESSION_SECRET absent). */
export async function createSessionToken(): Promise<string | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const expiry = Date.now() + SESSION_DURATION_MS;
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(String(expiry)));
  return `${expiry}.${toHex(signature)}`;
}

/** Vérifie qu'un jeton de session est valide (signature correcte + non expiré). */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const separatorIndex = token.indexOf(".");
  if (separatorIndex === -1) return false;
  const expiryStr = token.slice(0, separatorIndex);
  const signatureHex = token.slice(separatorIndex + 1);

  const expiry = Number(expiryStr);
  if (!expiry || Number.isNaN(expiry) || Date.now() > expiry) return false;

  const key = await getKey(secret);
  const expectedSignature = await crypto.subtle.sign("HMAC", key, encoder.encode(expiryStr));
  const expectedHex = toHex(expectedSignature);

  if (expectedHex.length !== signatureHex.length) return false;
  // Comparaison en temps constant pour éviter les attaques par mesure de timing.
  let diff = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    diff |= expectedHex.charCodeAt(i) ^ signatureHex.charCodeAt(i);
  }
  return diff === 0;
}

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = SESSION_DURATION_MS / 1000; // en secondes, pour les cookies
