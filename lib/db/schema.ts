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
