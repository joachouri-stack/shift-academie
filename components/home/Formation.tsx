import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { formations } from "@/lib/content";
import styles from "./Formation.module.css";

const secteursAVenir = [
  "Commerce",
  "Métiers de bouche",
  "Agriculture",
  "Et d'autres secteurs",
];

export default function Formation() {
  return (
    <section className="section" id="formation" aria-labelledby="formation-title">
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">Notre formation</span>
          <h2 id="formation-title" className={styles.title}>
            Une formation, des résultats concrets.
          </h2>
          <p className="lead">
            Aujourd&rsquo;hui, nous concentrons toute notre énergie sur une
            seule formation, pensée pour les professionnels de terrain. D&rsquo;autres
            secteurs arrivent.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {formations.map((f) => (
            <Reveal key={f.slug} className={styles.cardWrap}>
              <article className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.tag}>Disponible</span>
                  <span className={styles.sector}>Création d&rsquo;activité</span>
                </div>
                <h3 className={styles.cardTitle}>{f.titre}</h3>
                <p className={styles.accroche}>{f.accroche}</p>
                <p className={styles.resume}>{f.resume}</p>

                <ul className={styles.meta}>
                  {f.formats.map((fmt) => (
                    <li key={fmt}>{fmt}</li>
                  ))}
                  <li>{f.niveau}</li>
                  <li>{f.certification}</li>
                </ul>

                <div className={styles.actions}>
                  <Button href="/programme" variant="primary" arrow>
                    Voir le programme
                  </Button>
                  <Button href="/inscription" variant="outline">
                    S&rsquo;inscrire
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}

          {/* Carte évolutivité — secteurs à venir */}
          <Reveal className={styles.cardWrap} delay={80}>
            <article className={`${styles.card} ${styles.soon}`}>
              <span className={styles.soonTag}>Bientôt</span>
              <h3 className={styles.cardTitle}>D&rsquo;autres secteurs</h3>
              <p className={styles.resume}>
                [Shift] Académie élargit son catalogue. Les mêmes méthodes,
                adaptées à votre métier.
              </p>
              <ul className={styles.sectorList}>
                {secteursAVenir.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className={styles.soonNote}>
                Un besoin précis ? Parlez-nous de votre secteur.
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
