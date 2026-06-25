import Reveal from "@/components/ui/Reveal";
import { badges } from "@/lib/content";
import styles from "./Qualiopi.module.css";

export default function Qualiopi() {
  return (
    <section className={styles.section} aria-labelledby="qualiopi-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.content}>
          <span className="eyebrow">Démarche qualité</span>
          <h2 id="qualiopi-title" className={styles.title}>
            Organisme engagé dans une démarche qualité.
          </h2>
          <p className={styles.text}>
            [Shift] Académie respecte les exigences qualité attendues des
            organismes de formation. Nos contenus, nos méthodes et nos
            indicateurs sont conçus pour garantir une formation claire, utile et
            orientée résultats.
          </p>

          <div className={styles.qualiopi}>
            <div className={styles.qLogo} aria-hidden="true">
              Qualiopi
            </div>
            <p className={styles.qText}>
              La certification qualité a été délivrée au titre de la catégorie
              <strong> actions de formation</strong>.
            </p>
          </div>
        </Reveal>

        <Reveal className={styles.badgeCard} delay={80}>
          <h3 className={styles.badgeTitle}>Nos engagements</h3>
          <ul className={styles.badgeGrid}>
            {badges.map((b) => (
              <li key={b} className={styles.badgeItem}>
                <span className={styles.badgeIcon} aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="18" height="18">
                    <path
                      d="M4 10.5l4 4 8-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
