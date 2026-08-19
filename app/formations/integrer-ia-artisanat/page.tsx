import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { BadgeRow } from "@/components/ui/Badge";
import { badges, formations } from "@/lib/content";
import styles from "../creer-son-entreprise/detail.module.css";

const formation = formations.find((f) => f.slug === "integrer-ia-artisanat")!;

export const metadata: Metadata = {
  title: "Intégrer l'IA dans l'artisanat — Formation (à venir)",
  description:
    "Formation « Intégrer l'IA dans l'artisanat » (14h, 2 jours) : automatiser devis, rapports, administratif et mémoires techniques grâce à l'IA. Ouverture des inscriptions prochainement.",
  alternates: { canonical: "/formations/integrer-ia-artisanat" },
};

const facts = [
  { label: "Durée", value: formation.duree },
  { label: "Format", value: "100 % à distance" },
  { label: "Niveau", value: formation.niveau },
  { label: "À la clé", value: formation.certification },
];

const objectifs = [
  "Prendre en main les outils d'IA du quotidien (ChatGPT, Claude, Gemini).",
  "Automatiser la création de vos devis et de vos rapports.",
  "Gagner du temps sur tout votre administratif et vos courriers.",
  "Rédiger vos mémoires techniques plus vite grâce à l'IA.",
  "Mettre en place un workflow IA prêt à l'emploi, sur vos vrais dossiers.",
];

const outils = ["ChatGPT", "Claude", "Gemini"];

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className={styles.objList}>
      {items.map((i) => (
        <li key={i}>
          <span className={styles.check} aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path
                d="M3.5 8.5l3 3 6-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {i}
        </li>
      ))}
    </ul>
  );
}

export default function FormationArtisanatPage() {
  return (
    <>
      <PageHero
        eyebrow="Formation · Prochainement"
        title={formation.titre}
        lead={`${formation.accroche} ${formation.resume}`}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Formations", href: "/formations" },
          { label: formation.titre },
        ]}
      />

      <div className="section">
        <div className="container">
          {/* Bandeau prochainement */}
          <Reveal className={styles.soonBanner}>
            <span className={styles.soonDot} aria-hidden="true" />
            <p>
              <strong>Formation en préparation.</strong> Le programme détaillé
              (modules et horaires) sera publié à l&rsquo;ouverture des
              inscriptions. Laissez-nous vos coordonnées pour être prévenu·e en
              priorité.
            </p>
          </Reveal>

          {/* Faits clés */}
          <Reveal as="ul" className={styles.facts}>
            {facts.map((f) => (
              <li key={f.label} className={styles.fact}>
                <span className={styles.factLabel}>{f.label}</span>
                <span className={styles.factValue}>{f.value}</span>
              </li>
            ))}
          </Reveal>

          <div className={styles.badgesWrap}>
            <BadgeRow items={badges} />
          </div>

          {/* Objectifs / au programme */}
          <Reveal className={styles.block}>
            <h2 className={styles.h2}>Ce que vous allez maîtriser</h2>
            <p className="lead">
              Zéro théorie, zéro jargon — on travaille sur vos vrais dossiers.
            </p>
            <CheckList items={objectifs} />
          </Reveal>

          {/* Outils */}
          <Reveal className={styles.panel}>
            <h3 className={styles.h3}>Outils utilisés</h3>
            <ul className={styles.chips}>
              {outils.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </Reveal>

          {/* CTA */}
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaTitle}>Intéressé·e par cette formation ?</h2>
            <p>
              Soyez informé·e dès l&rsquo;ouverture des inscriptions. On vous
              recontacte sous 24h, sans engagement.
            </p>
            <div className={styles.ctaButtons}>
              <Button href="/inscription" variant="gold" size="lg" arrow>
                Être informé du lancement
              </Button>
              <Button href="/formations" variant="light" size="lg">
                Retour aux formations
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
