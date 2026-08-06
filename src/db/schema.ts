import { pgTable, text, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";

// Table des Catégories
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  visible: boolean("visible").default(true).notNull(),
});

// Table des Produits
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  brand: text("brand").default("ANZY").notNull(),
  name: text("name").notNull(),
  categoryId: text("category_id").references(() => categories.id),
  badge: text("badge").default("Nouveauté"),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("XOF").notNull(),
  material: text("material"),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  colors: jsonb("colors").$type<{ name: string; hex: string }[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  stock: integer("stock").default(0).notNull(),
  visible: boolean("visible").default(true).notNull(),
  options: jsonb("options").$type<{ name: string; values: string[] }[]>().default([]),
  variantes: jsonb("variantes").$type<{
    id: string;
    combo: Record<string, string>;
    price: number;
    stock: number;
    image: string;
    active: boolean;
  }[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Table de gestion du contenu dynamique
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  hero: jsonb("hero").notNull(),
  about: jsonb("about").notNull(),
  footer: jsonb("footer").notNull(),
  social: jsonb("social").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NOUVELLE TABLE : Les Avis Clients avec modération
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(), // false = en attente dans ton admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});