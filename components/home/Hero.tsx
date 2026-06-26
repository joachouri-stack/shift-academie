import Button from "@/components/ui/Button";
import { heroBadges, site } from "@/lib/content";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.glowA} aria-hidden="true" />
      <div className={styles.glowB} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Organisme de formation certifié Qualiopi
          </span>

          <h1 id="hero-title" className={styles.title}>
            Lancez votre activité{" "}
            <span className={styles.accentWord}>indépendante</span>, de
            l&rsquo;idée aux <span className={styles.goldWord}>premiers clients</span>.
          </h1>

          <p className={styles.subtitle}>
            Apprenez à utiliser l&rsquo;intelligence artificielle pour créer,
            lancer et développer votre activité avec des outils simples,
            concrets et directement applicables.
          </p>

          <div className={styles.cta}>
            <Button href="/programme" variant="gold" size="lg" arrow>
              Voir le programme détaillé
            </Button>
            <Button href="/inscription" variant="light" size="lg">
              S&rsquo;inscrire gratuitement
            </Button>
          </div>

          <ul className={styles.badges}>
            {heroBadges.map((b) => (
              <li key={b} className={styles.badge}>
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                  <path
                    d="M3.5 8.5l3 3 6-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Carte formation flottante */}
        <aside className={styles.card} aria-label="Formation phare">
          <div className={styles.cardGlow} aria-hidden="true" />
          <span className={styles.cardTag}>Formation disponible</span>
          <h2 className={styles.cardTitle}>Créer son entreprise</h2>
          <p className={styles.cardText}>
            De l&rsquo;idée au lancement, avec l&rsquo;IA comme copilote.
          </p>

          <ul className={styles.cardList}>
            <li>
              <span className={styles.cardKey}>Format</span>
              <span className={styles.cardVal}>Présentiel &amp; distanciel</span>
            </li>
            <li>
              <span className={styles.cardKey}>Niveau</span>
              <span className={styles.cardVal}>Accessible aux débutants</span>
            </li>
            <li>
              <span className={styles.cardKey}>Certification</span>
              <span className={styles.cardVal}>RS6776</span>
            </li>
            <li>
              <span className={styles.cardKey}>Réponse</span>
              <span className={styles.cardVal}>Sous 24h</span>
            </li>
          </ul>

          <Button href="/inscription" variant="accent" arrow fullWidth>
            Réserver ma place
          </Button>
          <p className={styles.cardNote}>
            Sans engagement · {site.responseTime}
          </p>
        </aside>
      </div>
    </section>
  );
}
