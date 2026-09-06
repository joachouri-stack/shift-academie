import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  inscriptions,
  modules,
  progression,
  sessionsVisionnage,
  visionnageHeartbeats,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Finalise une session de visionnage (append-only).
 * Reçu en fin de lecture (pause / fin / fermeture d'onglet, via sendBeacon).
 * La durée de la session est RECALCULÉE côté serveur en sommant les deltas des
 * heartbeats reçus depuis le début de la session → non falsifiable par le client.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  let body: { inscriptionId?: string; moduleId?: string; startedAt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { inscriptionId, moduleId, startedAt } = body;
  if (!inscriptionId || !moduleId || !startedAt) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const debut = new Date(startedAt);
  if (Number.isNaN(debut.getTime())) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

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
  if (!inscription) return NextResponse.json({ ok: false }, { status: 403 });

  const mod = db.select().from(modules).where(eq(modules.id, moduleId)).get();
  if (!mod || mod.formationId !== inscription.formationId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Durée réellement créditée pendant cette session = somme des deltas serveur.
  const agg = db
    .select({
      total: sql<number>`coalesce(sum(${visionnageHeartbeats.deltaS}), 0)`,
    })
    .from(visionnageHeartbeats)
    .where(
      and(
        eq(visionnageHeartbeats.inscriptionId, inscriptionId),
        eq(visionnageHeartbeats.moduleId, moduleId),
        gte(visionnageHeartbeats.createdAt, debut)
      )
    )
    .get();
  const dureeEffective = agg?.total ?? 0;

  // Pourcentage global du module au moment de la clôture.
  const prog = db
    .select()
    .from(progression)
    .where(
      and(
        eq(progression.inscriptionId, inscriptionId),
        eq(progression.moduleId, moduleId)
      )
    )
    .get();
  const cumulee = prog?.dureeEffectiveCumulee ?? 0;
  const pourcentage =
    mod.dureeSecondes > 0
      ? Math.min(100, Math.round((cumulee / mod.dureeSecondes) * 100))
      : 0;

  db.insert(sessionsVisionnage)
    .values({
      id: randomUUID(),
      inscriptionId,
      moduleId,
      apprenantId: user.id,
      timestampDebut: debut,
      timestampFin: new Date(),
      dureeEffectiveSecondes: dureeEffective,
      pourcentageComplete: pourcentage,
      createdAt: new Date(),
    })
    .run();

  return NextResponse.json({ ok: true });
}
