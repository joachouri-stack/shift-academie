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
              variant="whatsapp"
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.15-.174.198-.298.297-.497.099-.198.05-.372-.025-.521-.074-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z" />
                </svg>
                WhatsApp · Échanger maintenant
              </span>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
