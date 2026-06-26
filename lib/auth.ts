import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { users, type User } from "./db/schema";

const COOKIE_NAME = "shift_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-a-changer-en-production-shift-academie"
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/* Crée la session : signe un JWT et le pose en cookie httpOnly. */
export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

async function getUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload.uid as string) ?? null;
  } catch {
    return null;
  }
}

/* Utilisateur connecté (ou null). */
export async function getCurrentUser(): Promise<User | null> {
  const id = await getUserId();
  if (!id) return null;
  const user = db.select().from(users).where(eq(users.id, id)).get();
  return user ?? null;
}

/* Exige un utilisateur connecté (sinon redirige vers la connexion). */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return user;
}

/* Exige un administrateur (sinon redirige). */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  if (user.role !== "admin") redirect("/espace");
  return user;
}
