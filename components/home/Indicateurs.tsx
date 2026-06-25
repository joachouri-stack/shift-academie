import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { indicateurs, indicateursPlaceholder } from "@/lib/content";
import styles from "./Indicateurs.module.css";

export default function Indicateurs() {
  const aucuneDonnee = indicateurs.every((i) => i.value === null);

  return (
    <section className="section" id="indicateurs" aria-labelledby="ind-title">
      <div className="container">
        <SectionHeader
          eyebrow="Indicateurs de qualité"
          title="Nos résultats publics."
          lead="Conformément à la certification Qualiopi, nous publions nos indicateurs de performance en toute transparence. Mis à jour à chaque session."
        />

        <div className={styles.grid}>
          {indicateurs.map((ind, i) => (
            <Reveal key={ind.label} className={styles.cardWrap} delay={i * 60}>
              <div className={styles.card}>
                <span className={styles.value}>
                  {ind.value === null ? "—" : `${ind.value}${ind.suffix}`}
                </span>
                <span className={styles.label}>{ind.label}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {aucuneDonnee && (
          <Reveal className={styles.placeholder}>
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <circle
                cx="10"
                cy="10"
                r="8.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M10 6v4.5M10 13.6h.01"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            {indicateursPlaceholder}
          </Reveal>
        )}
      </div>
    </section>
  );
}
