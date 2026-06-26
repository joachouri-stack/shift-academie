import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/* Comptes utilisateurs (apprenants et admin). */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  // "learner" | "admin"
  role: text("role").notNull().default("learner"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;

/* Formations en ligne (gérées par l'admin). */
export const formations = sqliteTable("formations", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  // "distanciel" | "presentiel" | "both"
  format: text("format").notNull().default("distanciel"),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  position: integer("position").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Formation = typeof formations.$inferSelect;

/* Modules d'une formation. */
export const modules = sqliteTable("modules", {
  id: text("id").primaryKey(),
  formationId: text("formation_id").notNull(),
  title: text("title").notNull(),
  position: integer("position").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Module = typeof modules.$inferSelect;

/* Demandes issues du formulaire de réservation. */
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  prenom: text("prenom").notNull(),
  nom: text("nom").notNull(),
  metier: text("metier").notNull().default(""),
  nombre: text("nombre").notNull().default(""),
  email: text("email").notNull(),
  telephone: text("telephone").notNull().default(""),
  format: text("format").notNull().default(""),
  periode: text("periode").notNull().default(""),
  message: text("message").notNull().default(""),
  handled: integer("handled", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Lead = typeof leads.$inferSelect;
