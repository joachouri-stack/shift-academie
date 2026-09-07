import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * État de connexion minimal pour l'en-tête (client). Ne renvoie que le
 * strict nécessaire pour afficher le bon bouton — jamais d'infos sensibles.
 */
export async function GET() {
  const user = await getCurrentUser();
  const body = user
    ? { user: { firstName: user.firstName, role: user.role } }
    : { user: null };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
