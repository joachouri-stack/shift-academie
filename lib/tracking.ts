import "server-only";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { progression, visionnageHeartbeats } from "./db/schema";

/**
 * Cœur du suivi d'assiduité — conçu pour être INFALSIFIABLE côté serveur.
 *
 * Le client (lecteur vidéo) envoie un « heartbeat » à intervalle régulier tant
 * que la vidéo est réellement en lecture et l'onglet actif. Le serveur crédite
 * le temps de visionnage UNIQUEMENT à partir de l'écart réel entre deux
 * heartbeats consécutifs, PLAFONNÉ à MAX_DELTA_S. Conséquences :
 *  - impossible d'envoyer « j'ai fini » : seul le temps réellement écoulé compte ;
 *  - une avance rapide (seek) ne crédite aucun temps ;
 *  - une pause / un onglet fermé crée un écart > MAX_DELTA_S → non crédité.
 *
 * Chaque heartbeat est journalisé en append-only (preuve brute d'audit).
 * `progression` n'est qu'un cache d'état recalculable depuis ces logs.
 */

export const HEARTBEAT_INTERVAL_S = 15;
// Tolérance : au-delà de cet écart entre 2 heartbeats, on considère qu'il y a eu
// interruption (pause, onglet inactif, réseau) → le temps n'est pas crédité.
export const MAX_DELTA_S = 25;
// Un module est validé quand le temps réellement visionné atteint ce ratio de sa durée.
export const VALIDATION_RATIO = 0.9;

export type HeartbeatResult = {
  dureeEffectiveCumulee: number;
  maxPositionS: number;
  pourcentage: number;
  valide: boolean;
};

export function recordHeartbeat(params: {
  inscriptionId: string;
  moduleId: string;
  apprenantId: string;
  positionS: number;
  moduleDureeSecondes: number;
}): HeartbeatResult {
  const now = new Date();
  const nowMs = now.getTime();
  const posS = Math.max(0, Math.floor(params.positionS || 0));
  const dureeRef = Math.max(0, Math.floor(params.moduleDureeSecondes || 0));

  const prog = db
    .select()
    .from(progression)
    .where(
      and(
        eq(progression.inscriptionId, params.inscriptionId),
        eq(progression.moduleId, params.moduleId)
      )
    )
    .get();

  // Temps crédité = écart réel depuis le dernier heartbeat, plafonné.
  // Premier heartbeat d'une session (ou reprise après interruption) : 0.
  let credited = 0;
  if (prog?.lastHeartbeatAt) {
    const gap = Math.round((nowMs - prog.lastHeartbeatAt.getTime()) / 1000);
    credited = gap > 0 && gap <= MAX_DELTA_S ? gap : 0;
  }

  const prevDuree = prog?.dureeEffectiveCumulee ?? 0;
  const newDuree = prevDuree + credited;
  const newMaxPos = Math.max(prog?.maxPositionS ?? 0, posS);
  const pourcentage =
    dureeRef > 0 ? Math.min(100, Math.round((newDuree / dureeRef) * 100)) : 0;

  const dejaValide = prog?.valide ?? false;
  const valide =
    dejaValide || (dureeRef > 0 && newDuree >= dureeRef * VALIDATION_RATIO);
  const dateValidation =
    prog?.dateValidation ?? (valide && !dejaValide ? now : null);

  // 1) Preuve brute append-only
  db.insert(visionnageHeartbeats)
    .values({
      id: randomUUID(),
      inscriptionId: params.inscriptionId,
      moduleId: params.moduleId,
      apprenantId: params.apprenantId,
      positionS: posS,
      deltaS: credited,
      createdAt: now,
    })
    .run();

  // 2) Cache d'état (progression)
  if (prog) {
    db.update(progression)
      .set({
        dureeEffectiveCumulee: newDuree,
        maxPositionS: newMaxPos,
        valide,
        dateValidation,
        lastHeartbeatAt: now,
        updatedAt: now,
      })
      .where(eq(progression.id, prog.id))
      .run();
  } else {
    db.insert(progression)
      .values({
        id: randomUUID(),
        inscriptionId: params.inscriptionId,
        moduleId: params.moduleId,
        apprenantId: params.apprenantId,
        dureeEffectiveCumulee: newDuree, // 0 au tout premier heartbeat
        maxPositionS: newMaxPos,
        valide,
        dateValidation,
        lastHeartbeatAt: now,
        updatedAt: now,
      })
      .run();
  }

  return {
    dureeEffectiveCumulee: newDuree,
    maxPositionS: newMaxPos,
    pourcentage,
    valide,
  };
}
