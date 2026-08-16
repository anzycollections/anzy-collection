import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { getProductById } from "@/lib/getProductById";

type Params = { params: Promise<{ id: string }> };

// Génère les balises Open Graph / Twitter Card à partir des vraies données du
// produit — c'est ce que WhatsApp, Messenger, iMessage, Facebook, etc. lisent
// pour afficher une miniature riche (photo + titre + prix) au lieu d'un
// simple lien nu quand quelqu'un partage la fiche produit.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Produit — ANZY COLLECTION" };
  }

  const images = (product.images as string[] | null) || [];
  const image = images[0];
  const price = Number(product.price).toLocaleString();
  const description = product.description
    ? product.description.slice(0, 150)
    : `${price} F CFA — ANZY COLLECTION`;

  return {
    title: `${product.name} — ANZY COLLECTION`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: image ? [{ url: image, width: 1200, height: 1500, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProduitPage({ params }: Params) {
  const { id } = await params;
  return <HomeContent initialProductId={id} />;
}
