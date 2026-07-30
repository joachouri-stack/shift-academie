import Reveal from "@/components/ui/Reveal";
import PartnerLogo from "@/components/ui/PartnerLogo";
import { financeurs } from "@/lib/content";
import styles from "./Financeurs.module.css";

export default function Financeurs() {
  return (
    <section className={styles.section} aria-labelledby="financeurs-title">
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">Financement</span>
          <h2 id="financeurs-title" className={styles.title}>
            Nos OPCO partenaires
          </h2>
          <p className="lead">
            Selon votre secteur, votre formation peut être prise en charge par
            votre OPCO. On vous accompagne pour monter votre dossier.
          </p>
        </Reveal>

        <ul className={styles.grid}>
          {financeurs.map((f, i) => (
            <Reveal as="li" key={f.nom} className={styles.card} delay={i * 60}>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inner}
              >
                <span className={styles.logoBox}>
                  <PartnerLogo
                    src={f.logo}
                    alt={f.nom}
                    className={styles.logo}
                    fallbackClassName={styles.fallback}
                  />
                </span>
                <span className={styles.secteur}>{f.secteur}</span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal className={styles.badges}>
          <span className={styles.badgesLabel}>Financements possibles :</span>
          <ul className={styles.badgeRow}>
            {financeurs.map((f) => (
              <li key={f.nom}>{f.nom}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
