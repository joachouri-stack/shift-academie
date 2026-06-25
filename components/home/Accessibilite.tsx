import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { accessibilite, site } from "@/lib/content";
import styles from "./Accessibilite.module.css";

export default function Accessibilite() {
  return (
    <section className="section" id="accessibilite" aria-labelledby="acc-title">
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">07 · Accessibilité &amp; inclusion</span>
          <h2 id="acc-title" className={styles.title}>
            La formation est ouverte à tous les profils.
          </h2>
          <p className="lead">
            Vous êtes en situation de handicap, ou un de vos collaborateurs
            l&rsquo;est ? On adapte la formation à votre besoin réel — pas
            l&rsquo;inverse.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {accessibilite.map((c, i) => (
            <Reveal key={c.num} className={styles.cardWrap} delay={i * 60}>
              <article className={styles.card}>
                <span className={styles.num}>{c.num}</span>
                <h3 className={styles.cardTitle}>{c.titre}</h3>
                <p className={styles.cardText}>{c.texte}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Bloc contact référent */}
        <Reveal className={styles.contact}>
          <div className={styles.contactMain}>
            <span className={styles.contactEyebrow}>Contact référent</span>
            <p className={styles.contactName}>{site.founder}</p>
            <p className={styles.contactRole}>
              Référent handicap · Fondateur [Shift] Académie
            </p>
            <p className={styles.contactNote}>
              Contactez-nous en amont — toute demande est étudiée sous 24 h
              ouvrées.
            </p>
          </div>

          <div className={styles.contactActions}>
            <a
              className={styles.contactLink}
              href={`tel:${site.phone.replace(/\s/g, "")}`}
            >
              <span className={styles.contactLabel}>Téléphone</span>
              <span className={styles.contactValue}>{site.phoneDisplay}</span>
            </a>
            <a className={styles.contactLink} href={`mailto:${site.email}`}>
              <span className={styles.contactLabel}>Email</span>
              <span className={styles.contactValue}>{site.email}</span>
            </a>
            <Button href={site.whatsapp} external variant="accent" arrow>
              WhatsApp · Échanger maintenant
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
