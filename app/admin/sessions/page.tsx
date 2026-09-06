import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, sessionsDirect, sessionsDirectParticipants } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import {
  createSessionDirect,
  toggleParticipant,
  deleteSessionDirect,
} from "../actions";
import styles from "../admin.module.css";

export const metadata: Metadata = {
  title: "Sessions live",
  robots: { index: false, follow: false },
};

function fmt(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(d);
}

export default async function SessionsPage() {
  await requireAdmin();

  const learners = db
    .select()
    .from(users)
    .all()
    .filter((u) => u.role !== "admin");

  const sessions = db
    .select()
    .from(sessionsDirect)
    .orderBy(desc(sessionsDirect.date))
    .all();

  return (
    <section className={styles.wrap}>
      <div className="container container-narrow">
        <Link href="/admin" className={styles.back}>
          ← Tableau de bord
        </Link>
        <h1 className={styles.title}>Sessions live (accompagnement synchrone)</h1>

        {/* Créer une session */}
        <div className={styles.block}>
          <h2 className={styles.h2}>Programmer une session</h2>
          <form action={createSessionDirect} className={styles.addRow}>
            <input type="datetime-local" name="date" required className={styles.input} />
            <input name="sujet" placeholder="Sujet (ex. Q&R module 2)" className={styles.input} />
            <input
              type="number"
              name="dureeMinutes"
              min={0}
              placeholder="Durée (min)"
              className={styles.input}
            />
            <button type="submit" className={styles.btnPrimary}>
              + Créer
            </button>
          </form>
        </div>

        {/* Liste des sessions + présence */}
        {sessions.length === 0 ? (
          <p className={styles.empty}>Aucune session pour l&rsquo;instant.</p>
        ) : (
          sessions.map((sess) => {
            const present = new Set(
              db
                .select()
                .from(sessionsDirectParticipants)
                .where(eq(sessionsDirectParticipants.sessionDirectId, sess.id))
                .all()
                .map((p) => p.apprenantId)
            );
            return (
              <div key={sess.id} className={styles.block}>
                <div className={styles.fItem}>
                  <span className={styles.fTitle}>
                    {fmt(sess.date)}
                    {sess.sujet && <span className={styles.modMeta}> · {sess.sujet}</span>}
                    <span className={styles.modMeta}>
                      {" "}
                      · {sess.dureeMinutes} min · {present.size} présent
                      {present.size > 1 ? "s" : ""}
                    </span>
                  </span>
                  <form action={deleteSessionDirect}>
                    <input type="hidden" name="id" value={sess.id} />
                    <button type="submit" className={styles.btnDanger}>
                      Supprimer
                    </button>
                  </form>
                </div>

                <p className={styles.hintNote}>Feuille de présence :</p>
                <div className={styles.presenceGrid}>
                  {learners.length === 0 ? (
                    <span className={styles.empty}>Aucun apprenant.</span>
                  ) : (
                    learners.map((u) => {
                      const here = present.has(u.id);
                      return (
                        <form key={u.id} action={toggleParticipant}>
                          <input type="hidden" name="sessionDirectId" value={sess.id} />
                          <input type="hidden" name="apprenantId" value={u.id} />
                          <button
                            type="submit"
                            className={`${styles.presenceBtn} ${
                              here ? styles.presenceOn : ""
                            }`}
                          >
                            {here ? "✓ " : ""}
                            {u.firstName} {u.lastName}
                          </button>
                        </form>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
