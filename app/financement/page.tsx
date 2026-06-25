import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { financement } from "@/lib/content";
import styles from "./financement.module.css";

export const metadata: Metadata = {
  title: "Financement",
  description:
    "Financez votre formation : Constructys, dispositifs selon profil, accompagnement au montage du dossier. Contact sous 24h, sans engagement.",
};

const etapes = [
  {
    num: "01",
    titre: "Vous nous contactez",
    texte: "Via le formulaire ou par téléphone. On fait le point sur votre situation.",
  },
  {
    num: "02",
    titre: "On étudie votre profil",
    texte: "On identifie ensemble le dispositif de financement le plus adapté.",
  },
  {
    num: "03",
    titre: "On monte le dossier",
    texte: "On prépare votre dossier de financement de A à Z, sans paperasse pour vous.",
  },
  {
    num: "04",
    titre: "Vous vous formez",
    texte: "Une fois le dossier validé, vous démarrez la formation sereinement.",
  },
];

export default function FinancementPage() {
  return (
    <>
      <PageHero
        eyebrow="Financement"
        title="Financez votre formation, simplement."
        lead={financement.intro}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Financement" }]}
      />

      <div className="section">
        <div className="container">
          <div className={styles.grid}>
            {financement.points.map((p, i) => (
              <Reveal key={p.titre} className={styles.card} delay={i * 60}>
                <h2 className={styles.cardTitle}>{p.titre}</h2>
                <p className={styles.cardText}>{p.texte}</p>
              </Reveal>
            ))}
          </div>

          {/* Étapes */}
          <h2 className={styles.h2}>Comment ça se passe ?</h2>
          <ol className={styles.steps}>
            {etapes.map((e, i) => (
              <Reveal key={e.num} as="li" className={styles.step} delay={i * 50}>
                <span className={styles.stepNum}>{e.num}</span>
                <h3 className={styles.stepTitle}>{e.titre}</h3>
                <p className={styles.stepText}>{e.texte}</p>
              </Reveal>
            ))}
          </ol>

          {/* Disclaimer honnête */}
          <Reveal className={styles.disclaimer}>
            <span className={styles.disclaimerIcon} aria-hidden="true">
              <svg viewBox="0 0 20 20" width="20" height="20">
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
            </span>
            <p>{financement.disclaimer}</p>
          </Reveal>

          {/* CTA */}
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaTitle}>On monte votre dossier ensemble.</h2>
            <p>Contact sous 24h · Sans engagement</p>
            <Button href="/inscription" variant="gold" size="lg" arrow>
              Demander mon dossier Constructys
            </Button>
          </Reveal>
        </div>
      </div>
    </>
  );
}
