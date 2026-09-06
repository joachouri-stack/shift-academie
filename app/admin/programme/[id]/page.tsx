import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { formations, modules } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { site } from "@/lib/content";
import PrintButton from "@/components/learn/PrintButton";
import doc from "../../assiduite/[inscriptionId]/rapport.module.css";
import styles from "./programme.module.css";

export const metadata: Metadata = {
  title: "Programme de formation",
  robots: { index: false, follow: false },
};

const FORMAT_LABEL: Record<string, string> = {
  distanciel: "100 % à distance (e-learning)",
  presentiel: "Présentiel",
  both: "Présentiel et/ou distanciel",
};

function hm(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  if (h > 0) return `${h} h ${String(m).padStart(2, "0")}`;
  return `${m} min`;
}

export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const formation = db
    .select()
    .from(formations)
    .where(eq(formations.id, id))
    .get();
  if (!formation) notFound();

  const mods = db
    .select()
    .from(modules)
    .where(eq(modules.formationId, id))
    .orderBy(asc(modules.position))
    .all();

  const objectifs = formation.objectifsPedagogiques
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);

  const prix =
    formation.prixCents > 0
      ? new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(formation.prixCents / 100)
      : "Sur devis";

  const dureeAff =
    formation.dureeHeures > 0 ? `${formation.dureeHeures} heures` : "À préciser";

  return (
    <section className={doc.wrap}>
      <div className="container container-narrow">
        <div className={doc.toolbar}>
          <Link href={`/admin/formations/${id}`} className={doc.back}>
            ← Retour à la formation
          </Link>
          <PrintButton className={doc.printBtn} />
        </div>

        <article className={doc.sheet}>
          <div className={doc.head}>
            <div>
              <p className={doc.brand}>
                <span className={doc.brandB}>[Shift]</span> Académie
              </p>
              <p className={doc.org}>
                Organisme de formation certifié Qualiopi · SIRET {site.siret}
              </p>
            </div>
            <h1 className={doc.docTitle}>Programme de formation</h1>
          </div>

          <div className={doc.meta}>
            <div>
              <span className={doc.metaLabel}>Intitulé</span>
              <span className={doc.metaVal}>{formation.title}</span>
            </div>
            <div>
              <span className={doc.metaLabel}>Durée</span>
              <span className={doc.metaVal}>{dureeAff}</span>
            </div>
            <div>
              <span className={doc.metaLabel}>Modalité</span>
              <span className={doc.metaVal}>
                {FORMAT_LABEL[formation.format] ?? formation.format}
              </span>
            </div>
            <div>
              <span className={doc.metaLabel}>Tarif</span>
              <span className={doc.metaVal}>{prix}</span>
            </div>
          </div>

          {formation.description && (
            <>
              <h2 className={doc.h2}>Présentation</h2>
              <p className={styles.prose}>{formation.description}</p>
            </>
          )}

          <h2 className={doc.h2}>Objectifs pédagogiques</h2>
          {objectifs.length > 0 ? (
            <ul className={styles.objList}>
              {objectifs.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.prose}>À compléter.</p>
          )}

          {mods.length > 0 && (
            <>
              <h2 className={doc.h2}>Contenu / déroulé</h2>
              <ol className={styles.modOl}>
                {mods.map((m, i) => (
                  <li key={m.id}>
                    <span>
                      {i + 1}. {m.title}
                    </span>
                    {m.dureeSecondes > 0 && (
                      <span className={styles.modDur}>{hm(m.dureeSecondes)}</span>
                    )}
                  </li>
                ))}
              </ol>
            </>
          )}

          <h2 className={doc.h2}>Méthodes pédagogiques</h2>
          <p className={styles.prose}>
            {formation.methodesPedagogiques || "À compléter."}
          </p>

          <h2 className={doc.h2}>Modalités d&rsquo;évaluation</h2>
          <p className={styles.prose}>
            {formation.modalitesEvaluation || "À compléter."}
          </p>

          <div className={doc.foot}>
            <p>
              {site.name} — Organisme de formation certifié Qualiopi. Programme
              susceptible d&rsquo;adaptation selon les besoins des apprenants et
              leur situation de handicap.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
