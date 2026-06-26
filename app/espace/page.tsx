import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/connexion/actions";
import { programme } from "@/lib/content";
import styles from "./espace.module.css";

export const metadata: Metadata = {
  title: "Mon espace apprenant",
  robots: { index: false, follow: false },
};

export default async function EspacePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const progress = 0; // sera calculé depuis les modules terminés (incrément suivant)

  return (
    <section className={styles.wrap}>
      <div className="container">
        {/* En-tête */}
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>Espace apprenant</p>
            <h1 className={styles.hello}>
              Bonjour {user.firstName} 👋
            </h1>
          </div>
          <form action={logoutAction}>
            <button type="submit" className={styles.logout}>
              Se déconnecter
            </button>
          </form>
        </div>

        {/* Carte formation */}
        <div className={styles.grid}>
          <article className={styles.course}>
            <div className={styles.courseHead}>
              <span className={styles.tag}>Formation</span>
              <span className={styles.format}>Distanciel</span>
            </div>
            <h2 className={styles.courseTitle}>{programme.titre}</h2>
            <p className={styles.courseText}>{programme.sousTitre}</p>

            <div className={styles.progress}>
              <div className={styles.progressTop}>
                <span>Progression</span>
                <span className={styles.progressVal}>{progress}%</span>
              </div>
              <div className={styles.bar}>
                <div className={styles.barFill} style={{ width: `${progress}%` }} />
              </div>
            </div>

            <button className={styles.continue} disabled>
              Contenu bientôt disponible
            </button>
            <p className={styles.note}>
              Vos modules, vidéos et supports apparaîtront ici dès l&rsquo;ouverture
              de votre session à distance.
            </p>
          </article>

          {/* Colonne infos */}
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
