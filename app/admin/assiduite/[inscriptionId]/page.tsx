import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  formations,
  inscriptions,
  modules,
  progression,
  sessionsVisionnage,
  users,
} from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { site } from "@/lib/content";
import PrintButton from "@/components/learn/PrintButton";
import styles from "./rapport.module.css";

export const metadata: Metadata = {
  title: "Rapport d'assiduité",
  robots: { index: false, follow: false },
};

function hm(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h > 0 ? `${h} h ${String(m).padStart(2, "0")}` : `${m} min`;
}

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(d);
}
function fmtDay(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(d);
}

export default async function RapportAssiduitePage({
  params,
}: {
  params: Promise<{ inscriptionId: string }>;
}) {
  await requireAdmin();
  const { inscriptionId } = await params;

  const inscription = db
    .select()
    .from(inscriptions)
    .where(eq(inscriptions.id, inscriptionId))
    .get();
  if (!inscription) notFound();

  const apprenant = db
    .select()
    .from(users)
    .where(eq(users.id, inscription.apprenantId))
    .get();
  const formation = db
    .select()
    .from(formations)
    .where(eq(formations.id, inscription.formationId))
    .get();

  const mods = db
    .select()
    .from(modules)
    .where(eq(modules.formationId, inscription.formationId))
    .orderBy(asc(modules.position))
    .all();

  const progs = db
    .select()
    .from(progression)
    .where(eq(progression.inscriptionId, inscription.id))
    .all();
  const progByModule = new Map(progs.map((p) => [p.moduleId, p]));

  const sessions = db
    .select()
    .from(sessionsVisionnage)
    .where(eq(sessionsVisionnage.inscriptionId, inscription.id))
    .orderBy(asc(sessionsVisionnage.timestampDebut))
    .all();

  // Heures réellement suivies : temps visionné plafonné à la durée de chaque module.
  const rows = mods.map((m) => {
    const p = progByModule.get(m.id);
    const cumulee = p?.dureeEffectiveCumulee ?? 0;
    const compte = m.dureeSecondes > 0 ? Math.min(cumulee, m.dureeSecondes) : cumulee;
    const pct =
      m.dureeSecondes > 0
        ? Math.min(100, Math.round((cumulee / m.dureeSecondes) * 100))
        : 0;
    return { m, cumulee, compte, pct, valide: p?.valide ?? false, dateValidation: p?.dateValidation ?? null };
  });

  const totalCompte = rows.reduce((a, r) => a + r.compte, 0);
  const totalReference = mods.reduce((a, m) => a + m.dureeSecondes, 0);
  const nbValides = rows.filter((r) => r.valide).length;
  const derniereActivite = sessions.length
    ? sessions[sessions.length - 1].timestampFin ??
      sessions[sessions.length - 1].timestampDebut
    : null;

  return (
    <section className={styles.wrap}>
      <div className="container container-narrow">
        <div className={styles.toolbar}>
          <Link href={`/admin/formations/${inscription.formationId}`} className={styles.back}>
            ← Retour à la formation
          </Link>
          <PrintButton className={styles.printBtn} />
        </div>

        <article className={styles.sheet}>
          <div className={styles.head}>
            <div>
              <p className={styles.brand}>
                <span className={styles.brandB}>[Shift]</span> Académie
              </p>
              <p className={styles.org}>
                Organisme de formation certifié Qualiopi · SIRET {site.siret}
              </p>
            </div>
            <h1 className={styles.docTitle}>Rapport d&rsquo;assiduité</h1>
          </div>

          <div className={styles.meta}>
            <div>
              <span className={styles.metaLabel}>Apprenant</span>
              <span className={styles.metaVal}>
                {apprenant ? `${apprenant.firstName} ${apprenant.lastName}` : "—"}
              </span>
              <span className={styles.metaSub}>{apprenant?.email}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>Formation</span>
              <span className={styles.metaVal}>{formation?.title ?? "—"}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>Début de parcours</span>
              <span className={styles.metaVal}>{fmtDay(inscription.dateDebut)}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>Dernière activité</span>
              <span className={styles.metaVal}>{fmtDate(derniereActivite)}</span>
            </div>
          </div>

          {/* Synthèse */}
          <div className={styles.summary}>
            <div className={styles.kpi}>
              <span className={styles.kpiVal}>{hm(totalCompte)}</span>
              <span className={styles.kpiLabel}>Heures réellement suivies</span>
            </div>
            <div className={styles.kpi}>
              <span className={styles.kpiVal}>
                {nbValides}/{mods.length}
              </span>
              <span className={styles.kpiLabel}>Modules validés</span>
            </div>
            <div className={styles.kpi}>
              <span className={styles.kpiVal}>{hm(totalReference)}</span>
              <span className={styles.kpiLabel}>Durée totale de référence</span>
            </div>
          </div>

          {/* Détail par module */}
          <h2 className={styles.h2}>Détail par module</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Module</th>
                <th>Durée réf.</th>
                <th>Temps suivi</th>
                <th>%</th>
                <th>Validé le</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.m.id}>
                  <td>{i + 1}</td>
                  <td>{r.m.title}</td>
                  <td>{hm(r.m.dureeSecondes)}</td>
                  <td>{hm(r.compte)}</td>
                  <td>{r.pct}%</td>
                  <td>
                    {r.valide ? (
                      <span className={styles.ok}>{fmtDay(r.dateValidation)}</span>
                    ) : (
                      <span className={styles.no}>Non validé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Journal des connexions (preuve append-only) */}
          <h2 className={styles.h2}>Journal des sessions de visionnage</h2>
          {sessions.length === 0 ? (
            <p className={styles.empty}>Aucune session enregistrée.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date &amp; heure</th>
                  <th>Module</th>
                  <th>Temps effectif</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => {
                  const mod = mods.find((m) => m.id === s.moduleId);
                  return (
                    <tr key={s.id}>
                      <td>{fmtDate(s.timestampDebut)}</td>
                      <td>{mod?.title ?? s.moduleId}</td>
                      <td>{hm(s.dureeEffectiveSecondes)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className={styles.foot}>
            <p>
              Document généré le {fmtDate(new Date())} par {site.name}. Les temps
              indiqués sont calculés à partir du visionnage réellement mesuré
              (journalisation horodatée infalsifiable).
            </p>
            <div className={styles.sign}>
              <span>Cachet et signature de l&rsquo;organisme</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
