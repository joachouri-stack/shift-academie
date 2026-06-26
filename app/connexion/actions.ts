"use server";

import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
} from "@/lib/auth";

export type AuthState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/* --- Inscription --- */
export async function registerAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const email = str(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!firstName || !lastName || !email || !password) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "L'adresse email semble invalide." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const existing = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .get();
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const id = randomUUID();
  db.insert(users)
    .values({
      id,
      email,
      passwordHash: await hashPassword(password),
      firstName,
      lastName,
      role: "learner",
      createdAt: new Date(),
    })
    .run();

  await createSession(id);
  redirect("/espace");
}

/* --- Connexion --- */
export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = str(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Merci de renseigner votre email et votre mot de passe." };
  }

  const user = db.select().from(users).where(eq(users.email, email)).get();
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await createSession(user.id);
  redirect("/espace");
}

/* --- Déconnexion --- */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/connexion");
}
