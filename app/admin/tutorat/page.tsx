import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { questionsTutorat, users, modules } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { answerQuestion } from "../actions";
import styles from "../admin.module.css";

export const metadata: Metadata = {
  title: "Tutorat",
  robots: { index: false, follow: false },
};

function fmt(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

export default async function TutoratPage() {
  await requireAdmin();

  const rows = db
    .select()
    .from(questionsTutorat)
    .orderBy(desc(questionsTutorat.dateQuestion))
    .all();

  const items = rows.map((q) => {
    const u = db.select().from(users).where(eq(users.id, q.apprenantId)).get();
    const m = q.moduleId
      ? db.select().from(modules).where(eq(modules.id, q.moduleId)).get()
      : null;
    return { q, u, m };
  });

  const pending = items.filter((i) => !i.q.reponse);
  const answered = items.filter((i) => i.q.reponse);

  function Card({ q, u, m }: (typeof items)[number]) {
    return (
      <li className={styles.qCard}>
        <div className={styles.qCardHead}>
          <span className={styles.qWho}>
            {u ? `${u.firstName} ${u.lastName}` : "Apprenant"}
            {m && <span className={styles.modMeta}> · {m.title}</span>}
          </span>
          <span className={styles.modMeta}>{fmt(q.dateQuestion)}</span>
        </div>
        <p className={styles.qText}>{q.question}</p>
        {q.reponse ? (
          <p className={styles.qAnswer}>
            <strong>Réponse</strong> ({q.dateReponse ? fmt(q.dateReponse) : "—"}) :{" "}
            {q.reponse}
          </p>
        ) : (
          <form action={answerQuestion} className={styles.answerForm}>
            <input type="hidden" name="id" value={q.id} />
            <textarea
              name="reponse"
              rows={2}
              required
              placeholder="Votre réponse…"
              className={styles.input}
            />
            <button type="submit" className={styles.btnPrimary}>
              Répondre
            </button>
          </form>
        )}
      </li>
    );
  }

  return (
    <section className={styles.wrap}>
      <div className="container container-narrow">
        <Link href="/admin" className={styles.back}>
          ← Tableau de bord
        </Link>
        <h1 className={styles.title}>Tutorat — questions des apprenants</h1>

        <div className={styles.block}>
          <h2 className={styles.h2}>
            En attente de réponse ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <p className={styles.empty}>Aucune question en attente. 👍</p>
          ) : (
            <ul className={styles.qCards}>
              {pending.map((it) => (
                <Card key={it.q.id} {...it} />
              ))}
            </ul>
          )}
        </div>

        <div className={styles.block}>
          <h2 className={styles.h2}>Répondues ({answered.length})</h2>
          {answered.length === 0 ? (
            <p className={styles.empty}>Aucune réponse pour l&rsquo;instant.</p>
          ) : (
            <ul className={styles.qCards}>
              {answered.map((it) => (
                <Card key={it.q.id} {...it} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
