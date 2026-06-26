import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { fondateur, site } from "@/lib/content";
import styles from "./apropos.module.css";

export const metadata: Metadata = {
  title: "À Propos",
  description:
    "[Shift] Académie, organisme de formation fondé par Johane Achouri. Notre mission : rendre l'IA simple, utile et accessible aux professionnels de terrain.",
};

const engagements = [
  {
    titre: "Praticité",
    texte: "Des outils que vous utilisez vraiment, dès le lendemain de la formation.",
  },
  {
    titre: "Accessibilité",
    texte: "Une formation ouverte à tous les profils, sans prérequis technique.",
  },
  {
    titre: "Résultats",
    texte: "On vise le concret : du temps gagné et une activité qui avance.",
  },
  {
    titre: "Transparence",
    texte: "Pas de promesse en l'air. Des indicateurs publics et un discours honnête.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="L'IA simple, utile, et au service du terrain."
        lead="[Shift] Académie est née d'un constat simple : trop de professionnels talentueux perdent un temps précieux sur des tâches qui pourraient être automatisées."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "À Propos" }]}
      />

      <section className="section">
        <div className={`container ${styles.founder}`}>
          <Reveal className={styles.founderCard}>
            <Avatar
              src="/assets/johane-achouri.jpg"
              alt={fondateur.nom}
              initials={fondateur.initiales}
              className={styles.avatar}
            />
            <p className={styles.fName}>{fondateur.nom}</p>
            <p className={styles.fRole}>{fondateur.role}</p>
            <ul className={styles.fTags}>
              {fondateur.valeurs.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal className={styles.founderText} delay={60}>
            <span className="eyebrow">Le fondateur</span>
            <h2 className={styles.h2}>{fondateur.nom}</h2>
            <p className={styles.baseline}>{fondateur.baseline}</p>
            <p className={styles.story}>{fondateur.texte}</p>
            <p className={styles.story}>
              Mon approche est simple : partir de votre réalité de terrain, et
              vous donner des outils que vous comprenez et que vous gardez. Pas
              de jargon, pas de complexité inutile — des résultats.
            </p>

            <ul className={styles.expertises}>
              {fondateur.expertises.map((e) => (
                <li key={e.label} className={styles.exp}>
                  <span className={styles.expLabel}>{e.label}</span>
                  <span className={styles.expTitle}>{e.titre}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className={styles.values}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">Nos engagements</span>
            <h2 className={styles.h2}>Ce qui guide chaque formation.</h2>
          </Reveal>
          <div className={styles.valuesGrid}>
            {engagements.map((e, i) => (
              <Reveal key={e.titre} className={styles.valueCard} delay={i * 50}>
                <h3 className={styles.valueTitle}>{e.titre}</h3>
                <p className={styles.valueText}>{e.texte}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaTitle}>Discutons de votre projet.</h2>
            <p>Réponse sous 24h, sans engagement.</p>
            <div className={styles.ctaButtons}>
              <Button href="/inscription" variant="gold" size="lg" arrow>
                S&rsquo;inscrire gratuitement
              </Button>
              <Button
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                variant="outline"
                size="lg"
              >
                {site.phoneDisplay}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
