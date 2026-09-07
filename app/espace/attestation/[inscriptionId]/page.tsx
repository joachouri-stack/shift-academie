import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  attestations,
  formations,
  inscriptions,
  modules,
  progression,
  users,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { site } from "@/lib/content";
import PrintButton from "@/components/learn/PrintButton";
import doc from "../../../admin/assiduite/[inscriptionId]/rapport.module.css";
import styles from "./attestation.module.css";

export const metadata: Metadata = {
  title: "Attestation de fin de formation",
  robots: { index: false, follow: false },
};

function hHm(heures: number) {
  const h = Math.floor(heures);
  const m = Math.round((heures - h) * 60);
  return m > 0 ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}
function fmtDay(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(d);
}

export default async function AttestationPage({
  params,
}: {
  params: Promise<{ inscriptionId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const { inscriptionId } = await params;
  const inscription = db
    .select()
    .from(inscriptions)
    .where(eq(inscriptions.id, inscriptionId))
    .get();
  if (!inscription) notFound();

  // Accès : l'apprenant propriétaire ou un admin.
  if (inscription.apprenantId !== user.id && user.role !== "admin") {
    redirect("/espace");
  }

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

  // Pas encore terminé → attestation indisponible.
  if (inscription.statut !== "termine") {
    return (
      <section className={doc.wrap}>
        <div className="container container-narrow">
          <Link href="/espace" className={doc.back}>
            ← Mon espace
          </Link>
          <div className={styles.pending}>
            <h1>Attestation pas encore disponible</h1>
            <p>
              Votre attestation de fin de formation sera générée
              automatiquement dès que <strong>tous les modules seront
              validés</strong> (visionnés à au moins 90 %).
            </p>
            <Link href="/espace" className={styles.pendingBtn}>
              Reprendre ma formation →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Attestation enregistrée (ou repli sur un calcul live).
  const att = db
    .select()
    .from(attestations)
    .where(eq(attestations.inscriptionId, inscription.id))
    .orderBy(desc(attestations.createdAt))
    .get();

  let heures = att?.heuresReelles ?? 0;
  if (!att) {
    const mods = db
      .select()
      .from(modules)
      .where(eq(modules.formationId, inscription.formationId))
      .all();
    const progs = db
      .select()
      .from(progression)
      .where(eq(progression.inscriptionId, inscription.id))
      .all();
    const byMod = new Map(progs.map((p) => [p.moduleId, p]));
    let sec = 0;
    for (const m of mods) {
      const c = byMod.get(m.id)?.dureeEffectiveCumulee ?? 0;
      sec += m.dureeSecondes > 0 ? Math.min(c, m.dureeSecondes) : c;
    }
    heures = Math.round((sec / 3600) * 100) / 100;
  }

  const nom = apprenant ? `${apprenant.firstName} ${apprenant.lastName}` : "—";

  return (
    <section className={doc.wrap}>
      <div className="container container-narrow">
        <div className={doc.toolbar}>
          <Link href="/espace" className={doc.back}>
            ← Mon espace
          </Link>
          <PrintButton className={doc.printBtn} />
        </div>

        <article className={`${doc.sheet} ${styles.cert}`}>
          <p className={styles.brand}>
            <span className={styles.brandB}>[Shift]</span> Académie
          </p>
          <p className={styles.org}>
            Organisme de formation certifié Qualiopi · SIRET {site.siret}
          </p>

          <h1 className={styles.certTitle}>Attestation de fin de formation</h1>

          <p className={styles.body}>
            Je soussigné(e), représentant de <strong>{site.name}</strong>,
            atteste que&nbsp;:
          </p>

          <p className={styles.name}>{nom}</p>

          <p className={styles.body}>
            a suivi la formation
            <br />
            <span className={styles.formation}>
              «&nbsp;{formation?.title ?? "—"}&nbsp;»
            </span>
          </p>

          <div className={styles.facts}>
            <div>
              <span className={styles.factVal}>{hHm(heures)}</span>
              <span className={styles.factLabel}>Heures réellement suivies</span>
            </div>
            <div>
              <span className={styles.factVal}>{fmtDay(inscription.dateDebut)}</span>
              <span className={styles.factLabel}>Début</span>
            </div>
            <div>
              <span className={styles.factVal}>{fmtDay(att?.dateFin ?? inscription.dateFin)}</span>
              <span className={styles.factLabel}>Fin</span>
            </div>
          </div>

          <p className={styles.legal}>
            Formation suivie à distance (e-learning), assiduité mesurée à partir
            du temps de visionnage réellement enregistré. Les heures indiquées
            correspondent au temps effectivement suivi.
          </p>

          <div className={styles.signRow}>
            <div>
              <p className={styles.signPlace}>Fait à {site.city || "France"}, le {fmtDay(new Date())}</p>
              <p className={styles.signName}>{site.founder}, {site.name}</p>
            </div>
            <div className={styles.seal}>Cachet de l&rsquo;organisme</div>
          </div>
        </article>
      </div>
    </section>
  );
}
