import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { formations, inscriptions, modules, progression } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/connexion/actions";
import styles from "./espace.module.css";

export const metadata: Metadata = {
  title: "Mon espace apprenant",
  robots: { index: false, follow: false },
};

export default async function EspacePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const rows = db
    .select()
    .from(inscriptions)
    .where(eq(inscriptions.apprenantId, user.id))
    .all();

  const courses = rows.map((ins) => {
    const formation = db
      .select()
      .from(formations)
      .where(eq(formations.id, ins.formationId))
      .get();
    const mods = db
      .select()
      .from(modules)
      .where(eq(modules.formationId, ins.formationId))
      .orderBy(asc(modules.position))
      .all();
    const validatedIds = new Set(
      db
        .select()
        .from(progression)
        .where(eq(progression.inscriptionId, ins.id))
        .all()
        .filter((p) => p.valide)
        .map((p) => p.moduleId)
    );
    const total = mods.length;
    const done = mods.filter((m) => validatedIds.has(m.id)).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const nextMod = mods.find((m) => !validatedIds.has(m.id)) ?? mods[0];
    return { ins, formation, mods, validatedIds, total, done, pct, nextMod };
  });

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>Espace apprenant</p>
            <h1 className={styles.hello}>Bonjour {user.firstName} 👋</h1>
          </div>
          <div className={styles.topActions}>
            {user.role === "admin" && (
              <Link href="/admin" className={styles.adminLink}>
                Espace admin →
              </Link>
            )}
            <form action={logoutAction}>
              <button type="submit" className={styles.logout}>
                Se déconnecter
              </button>
            </form>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.courses}>
            {courses.length === 0 ? (
              <article className={styles.course}>
                <h2 className={styles.courseTitle}>Aucune formation pour l&rsquo;instant</h2>
                <p className={styles.courseText}>
                  Dès qu&rsquo;une formation vous sera attribuée, elle
                  apparaîtra ici avec vos modules et votre progression.
                </p>
                <a href="/inscription" className={styles.helpLink}>
                  Nous contacter →
                </a>
              </article>
            ) : (
              courses.map(({ ins, formation, mods, validatedIds, total, done, pct, nextMod }) => (
                <article key={ins.id} className={styles.course}>
                  <div className={styles.courseHead}>
                    <span className={styles.tag}>Formation</span>
                    <span className={styles.format}>100 % à distance</span>
                  </div>
                  <h2 className={styles.courseTitle}>
                    {formation?.title ?? "Formation"}
                  </h2>

                  <div className={styles.progress}>
                    <div className={styles.progressTop}>
                      <span>
                        Progression — {done}/{total} module{total > 1 ? "s" : ""}
                      </span>
                      <span className={styles.progressVal}>{pct}%</span>
                    </div>
                    <div className={styles.bar}>
                      <div className={styles.barFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {mods.length === 0 ? (
                    <p className={styles.note}>
                      Les modules de cette formation seront bientôt disponibles.
                    </p>
                  ) : (
                    <>
                      {nextMod && (
                        <Link
                          href={`/espace/modules/${nextMod.id}`}
                          className={styles.continue}
                        >
                          {done === 0 ? "Commencer la formation" : "Continuer"} →
                        </Link>
                      )}
                      <ol className={styles.elMods}>
                        {mods.map((m, i) => {
                          const ok = validatedIds.has(m.id);
                          return (
                            <li key={m.id}>
                              <Link
                                href={`/espace/modules/${m.id}`}
                                className={styles.elModLink}
                              >
                                <span
                                  className={`${styles.elModDot} ${ok ? styles.elModDotOk : ""}`}
                                  aria-hidden="true"
                                >
                                  {ok ? "✓" : i + 1}
                                </span>
                                <span>{m.title}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ol>
                    </>
                  )}
                </article>
              ))
            )}
          </div>

          <aside className={styles.side}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Mon compte</h3>
              <ul className={styles.infoList}>
                <li>
                  <span>Nom</span>
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                </li>
                <li>
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </li>
              </ul>
            </div>

            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Besoin d&rsquo;aide ?</h3>
              <p className={styles.help}>
                Une question sur votre formation ou votre financement ?
                Contactez-nous, réponse sous 24h.
              </p>
              <a href="/inscription" className={styles.helpLink}>
                Nous contacter →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
