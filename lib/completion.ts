import "server-only";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { inscriptions, modules, progression, attestations } from "./db/schema";

/**
 * Clôt le parcours et génère l'attestation dès que TOUS les modules d'une
 * formation sont validés. Idempotent (ne fait rien si déjà terminé).
 * Les heures indiquées sont RÉELLES : temps visionné plafonné à la durée de
 * chaque module (on ne peut pas « suivre » plus que la durée du module).
 */
export function completeInscriptionIfDone(inscriptionId: string): boolean {
  const ins = db
    .select()
    .from(inscriptions)
    .where(eq(inscriptions.id, inscriptionId))
    .get();
  if (!ins || ins.statut === "termine") return false;

  const mods = db
    .select()
    .from(modules)
    .where(eq(modules.formationId, ins.formationId))
    .all();
  if (mods.length === 0) return false;

  const progs = db
    .select()
    .from(progression)
    .where(eq(progression.inscriptionId, ins.id))
    .all();
  const progByModule = new Map(progs.map((p) => [p.moduleId, p]));

  const allValid = mods.every((m) => progByModule.get(m.id)?.valide);
  if (!allValid) return false;

  let totalSec = 0;
  for (const m of mods) {
    const cumulee = progByModule.get(m.id)?.dureeEffectiveCumulee ?? 0;
    totalSec += m.dureeSecondes > 0 ? Math.min(cumulee, m.dureeSecondes) : cumulee;
  }
  const heures = Math.round((totalSec / 3600) * 100) / 100;
  const now = new Date();

  db.update(inscriptions)
    .set({ statut: "termine", dateFin: now })
    .where(eq(inscriptions.id, ins.id))
    .run();

  db.insert(attestations)
    .values({
      id: randomUUID(),
      inscriptionId: ins.id,
      apprenantId: ins.apprenantId,
      formationId: ins.formationId,
      heuresReelles: heures,
      dateDebut: ins.dateDebut,
      dateFin: now,
      pdfRef: "",
      createdAt: now,
    })
    .run();

  return true;
}
