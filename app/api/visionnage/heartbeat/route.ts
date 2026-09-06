import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { inscriptions, modules } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { recordHeartbeat } from "@/lib/tracking";

export const runtime = "nodejs";

/**
 * Reçoit un battement de lecture et crédite le temps d'assiduité côté serveur.
 * Body JSON : { inscriptionId, moduleId, positionS }
 * Sécurité : l'apprenant doit être connecté, propriétaire de l'inscription,
 * et le module doit appartenir à la formation de cette inscription.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { inscriptionId?: string; moduleId?: string; positionS?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { inscriptionId, moduleId } = body;
  const positionS = Number(body.positionS ?? 0);
  if (!inscriptionId || !moduleId || Number.isNaN(positionS)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // L'inscription doit exister, appartenir à l'apprenant, et être en cours.
  const inscription = db
    .select()
    .from(inscriptions)
    .where(
      and(
        eq(inscriptions.id, inscriptionId),
        eq(inscriptions.apprenantId, user.id)
      )
    )
    .get();

  if (!inscription) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if (inscription.statut !== "en_cours") {
    return NextResponse.json(
      { ok: false, message: "Parcours clôturé." },
      { status: 409 }
    );
  }

  // Le module doit appartenir à la formation de l'inscription.
  const mod = db
    .select()
    .from(modules)
    .where(eq(modules.id, moduleId))
    .get();

  if (!mod || mod.formationId !== inscription.formationId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const result = recordHeartbeat({
    inscriptionId,
    moduleId,
    apprenantId: user.id,
    positionS,
    moduleDureeSecondes: mod.dureeSecondes,
  });

  // maxPositionS permet au lecteur de bloquer l'avance rapide au-delà du réel.
  return NextResponse.json({ ok: true, ...result });
}
