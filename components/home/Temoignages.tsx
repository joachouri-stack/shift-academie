import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { temoignages } from "@/lib/content";
import styles from "./Temoignages.module.css";

export default function Temoignages() {
  return (
    <section className={styles.section} aria-labelledby="temoin-title">
      <div className="container">
        <SectionHeader
          eyebrow="Ils en parlent"
          title="Des professionnels qui gagnent du temps."
          lead="Des retours sobres, concrets, orientés résultats."
        />

        <div className={styles.grid}>
          {temoignages.map((t, i) => (
            <Reveal key={t.nom} className={styles.cardWrap} delay={i * 70}>
              <figure className={styles.card}>
                <span className={styles.quote} aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className={styles.text}>{t.texte}</blockquote>
                <figcaption className={styles.author}>
                  <span className={styles.avatar} aria-hidden="true">
                    {t.nom.charAt(0)}
                  </span>
                  <span>
                    <span className={styles.name}>{t.nom}</span>
                    <span className={styles.role}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
