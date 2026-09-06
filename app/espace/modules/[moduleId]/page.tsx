import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  formations,
  inscriptions,
  modules,
  progression,
  questionsTutorat,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { askQuestion } from "@/app/espace/actions";
import VideoPlayer from "@/components/learn/VideoPlayer";
import styles from "./module.module.css";

export const metadata: Metadata = {
  title: "Module",
  robots: { index: false, follow: false },
};

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const { moduleId } = await params;

  const mod = db.select().from(modules).where(eq(modules.id, moduleId)).get();
  if (!mod) notFound();

  const inscription = db
    .select()
    .from(inscriptions)
    .where(
      and(
        eq(inscriptions.apprenantId, user.id),
        eq(inscriptions.formationId, mod.formationId)
      )
    )
    .get();
  if (!inscription) redirect("/espace"); // pas inscrit à cette formation

  const formation = db
    .select()
    .from(formations)
    .where(eq(formations.id, mod.formationId))
    .get();

  const prog = db
    .select()
    .from(progression)
    .where(
      and(
        eq(progression.inscriptionId, inscription.id),
        eq(progression.moduleId, mod.id)
      )
    )
    .get();

  const allMods = db
    .select()
    .from(modules)
    .where(eq(modules.formationId, mod.formationId))
    .orderBy(asc(modules.position))
    .all();

  const validatedIds = new Set(
    db
      .select()
      .from(progression)
      .where(eq(progression.inscriptionId, inscription.id))
      .all()
      .filter((p) => p.valide)
      .map((p) => p.moduleId)
  );

  const currentIndex = allMods.findIndex((m) => m.id === mod.id);
  const next = allMods[currentIndex + 1];

  const questions = db
    .select()
    .from(questionsTutorat)
    .where(eq(questionsTutorat.inscriptionId, inscription.id))
    .orderBy(desc(questionsTutorat.dateQuestion))
    .all();

  return (
    <section className={styles.wrap}>
      <div className="container">
        <Link href="/espace" className={styles.back}>
          ← Mon espace
        </Link>

        <div className={styles.layout}>
          {/* Colonne principale : lecteur */}
          <div className={styles.main}>
            <p className={styles.eyebrow}>{formation?.title}</p>
            <h1 className={styles.title}>
              {currentIndex + 1}. {mod.title}
            </h1>

            {mod.videoRef ? (
              <VideoPlayer
                inscriptionId={inscription.id}
                moduleId={mod.id}
                videoUrl={mod.videoRef}
                dureeSecondes={mod.dureeSecondes}
                initialMaxPositionS={prog?.maxPositionS ?? 0}
                initialPourcentage={
                  mod.dureeSecondes > 0
                    ? Math.min(
                        100,
                        Math.round(
                          ((prog?.dureeEffectiveCumulee ?? 0) /
                            mod.dureeSecondes) *
                            100
                        )
                      )
                    : 0
                }
                initialValide={prog?.valide ?? false}
              />
            ) : (
              <div className={styles.noVideo}>
                La vidéo de ce module n&rsquo;est pas encore disponible.
              </div>
            )}

            {mod.contenu && <p className={styles.contenu}>{mod.contenu}</p>}

            {next && (
              <Link href={`/espace/modules/${next.id}`} className={styles.nextBtn}>
                Module suivant : {next.title} →
              </Link>
            )}

            {/* Tutorat : question au formateur */}
            <section className={styles.tutorat}>
              <h2 className={styles.tutTitle}>Une question sur ce module ?</h2>
              <form action={askQuestion} className={styles.askForm}>
                <input type="hidden" name="inscriptionId" value={inscription.id} />
                <input type="hidden" name="moduleId" value={mod.id} />
                <textarea
                  name="question"
                  rows={3}
                  required
                  placeholder="Posez votre question au formateur…"
                  className={styles.askInput}
                />
                <button type="submit" className={styles.askBtn}>
                  Envoyer au formateur
                </button>
              </form>

              {questions.length > 0 && (
                <ul className={styles.qList}>
                  {questions.map((q) => (
                    <li key={q.id} className={styles.qItem}>
                      <p className={styles.qQ}>{q.question}</p>
                      {q.reponse ? (
                        <p className={styles.qR}>
                          <strong>Réponse :</strong> {q.reponse}
                        </p>
                      ) : (
                        <p className={styles.qPending}>
                          En attente de réponse du formateur…
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Colonne latérale : sommaire */}
          <aside className={styles.side}>
            <h2 className={styles.sideTitle}>Modules</h2>
            <ol className={styles.modList}>
              {allMods.map((m, i) => {
                const isCurrent = m.id === mod.id;
                const done = validatedIds.has(m.id);
                return (
                  <li key={m.id}>
                    <Link
                      href={`/espace/modules/${m.id}`}
                      className={`${styles.modLink} ${
                        isCurrent ? styles.modCurrent : ""
                      }`}
                    >
                      <span className={styles.modCheck} aria-hidden="true">
                        {done ? "✓" : i + 1}
                      </span>
                      <span>{m.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}
