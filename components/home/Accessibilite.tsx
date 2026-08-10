import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { accessibilite, site } from "@/lib/content";
import styles from "./Accessibilite.module.css";

const ic = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* Icônes des 4 engagements accessibilité */
const accIcons = [
  // Référent handicap dédié — personne / contact
  <svg key="a" viewBox="0 0 24 24" width="22" height="22">
    <circle cx="12" cy="8" r="3.4" {...ic} />
    <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" {...ic} />
  </svg>,
  // Adaptations possibles — réglages / sliders
  <svg key="b" viewBox="0 0 24 24" width="22" height="22">
    <path d="M4 8h9M17 8h3M4 16h3M11 16h9" {...ic} />
    <circle cx="15" cy="8" r="2.2" {...ic} />
    <circle cx="9" cy="16" r="2.2" {...ic} />
  </svg>,
  // Réseau partenaire — nœuds connectés
  <svg key="c" viewBox="0 0 24 24" width="22" height="22">
    <circle cx="6" cy="7" r="2.3" {...ic} />
    <circle cx="18" cy="7" r="2.3" {...ic} />
    <circle cx="12" cy="17" r="2.3" {...ic} />
    <path d="M8 8.2l3 7M16 8.2l-3 7M8.2 7h7.6" {...ic} />
  </svg>,
  // Étude au cas par cas — loupe
  <svg key="d" viewBox="0 0 24 24" width="22" height="22">
    <circle cx="11" cy="11" r="6" {...ic} />
    <path d="M20 20l-4.3-4.3" {...ic} />
  </svg>,
];

export default function Accessibilite() {
  return (
    <section className="section" id="accessibilite" aria-labelledby="acc-title">
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">Accessibilité &amp; inclusion</span>
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
            <Reveal key={c.titre} className={styles.cardWrap} delay={i * 60}>
              <article className={styles.card}>
                <span className={styles.icon} aria-hidden="true">
                  {accIcons[i]}
                </span>
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
            <Button
              href={`${site.whatsapp}?text=${encodeURIComponent(
                "Bonjour, je souhaite en savoir plus sur vos formations et les possibilités de financement (CPF, OPCO)."
              )}`}
              external
              variant="accent"
              arrow
            >
              WhatsApp · Échanger maintenant
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
