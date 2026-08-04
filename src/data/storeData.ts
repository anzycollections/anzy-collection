// src/data/storeData.ts

export const storeData = {
  brand: {
    name: "Anzy Collection",
    tagline: "ELEVATED FEMININE FASHION & ESSENTIALS",
    founder: "Helena Mcneil",
    location: "France"
  },
  hero: {
    title: "EMPOWER YOUR BEAUTY",
    subtitle: "Découvrez notre collection exclusive conçue pour sublimer votre style quotidien avec élégance et authenticité.",
    cta: "Découvrir la Collection",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
  },
  categories: [
    { id: "all", name: "Toutes les pièces" },
    { id: "clothing", name: "Vêtements" },
    { id: "shoes", name: "Chaussures" },
    { id: "bags", name: "Sacs" },
    { id: "acc", name: "Accessoires" }
  ],
  products: [
    {
      id: "p1",
      brand: "ADIDAS ORIGINALS",
      name: "Cali Striped Polo Shirt",
      category: "clothing",
      badge: "Nouveauté",
      description: "Polo noir ajusté avec col classique et détails iconiques à trois bandes. Une pièce chic et décontractée.",
      price: 62,
      currency: "€",
      material: "Polyamide recyclé / Élasthanne",
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Noir Intense", hex: "#1C1C1E" },
        { name: "Rose Anzy", hex: "#E88D9E" },
        { name: "Blanc Pur", hex: "#FFFFFF" }
      ],
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "p2",
      brand: "ANZY COLLECTION",
      name: "T-Shirt Logo-Print Fitted",
      category: "clothing",
      badge: "Bestseller",
      description: "T-shirt en coton biologique stretch avec impression subtile du logo Anzy. Coupe près du corps ultra élégante.",
      price: 194,
      currency: "$",
      material: "100% Coton Biologique Premium",
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Noir", hex: "#121212" },
        { name: "Rose Poudré", hex: "#F3C5CD" }
      ],
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "p3",
      brand: "ANZY COLLECTION",
      name: "Short en Jean Taille Haute",
      category: "clothing",
      badge: "Incontournable",
      description: "Short en jean blanc cassé avec finition épurée et taille haute valorisante.",
      price: 112,
      currency: "$",
      material: "100% Denim Coton",
      sizes: ["26", "27", "28", "29"],
      colors: [
        { name: "Écru", hex: "#F5F3EF" }
      ],
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "p4",
      brand: "ADIDAS ORIGINALS",
      name: "Sneakers Samba OG Brown",
      category: "shoes",
      badge: "Tendance",
      description: "Tennis iconiques en suède marron chaud et semelle gomme pour un style streetwear raffiné.",
      price: 130,
      currency: "$",
      material: "Cuir Suède & Caoutchouc",
      sizes: ["37", "38", "39", "40", "41"],
      colors: [
        { name: "Suede Taupe", hex: "#9E8B78" }
      ],
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
    }
  ]
};

// Types pour l'auto-complétion dans VS Code
export type Product = typeof storeData.products[0];
export type Category = typeof storeData.categories[0];