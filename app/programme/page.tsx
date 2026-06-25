import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { BadgeRow } from "@/components/ui/Badge";
import { programme, badges } from "@/lib/content";
import styles from "./programme.module.css";

export const metadata: Metadata = {
  title: "Programme — Créer son entreprise",
  description:
    "Programme complet de la formation « Créer son entreprise » : objectifs, modules, public, prérequis, durée, financement et accessibilité.",
};

const infos = [
  { label: "Public concerné", value: programme.public },
  { label: "Prérequis", value: programme.prerequis },
  { label: "Durée", value: programme.duree },
  { label: "Format", value: programme.format },
  { label: "Moyens techniques", value: programme.moyens },
  { label: "Accessibilité handicap", value: programme.accessibilite },
  { label: "Certification / attestation", value: programme.certification },
  { label: "Financement possible", value: programme.financement },
];

export default function ProgrammePage() {
  return (
    <>
      <PageHero
        eyebrow="Programme"
        title={programme.titre}
        lead={programme.intro}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Programme" }]}
      />

      <div className="section">
        <div className="container">
          <BadgeRow items={badges} />

          {/* Objectifs */}
          <Reveal className={styles.objectives}>
            <h2 className={styles.h2}>Objectifs de la formation</h2>
            <ul className={styles.objList}>
              {programme.objectifs.map((o) => (
                <li key={o}>
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
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Modules */}
          <div className={styles.modulesHead}>
            <h2 className={styles.h2}>Le déroulé, module par module</h2>
            <p className="lead">
              Un parcours progressif, du cadrage de votre projet jusqu&rsquo;au
              lancement de votre activité.
            </p>
          </div>

          <ol className={styles.modules}>
            {programme.modules.map((m, i) => (
              <Reveal key={m.num} as="li" className={styles.module} delay={i * 50}>
                <div className={styles.moduleNum}>{m.num}</div>
                <div className={styles.moduleBody}>
                  <h3 className={styles.moduleTitle}>{m.titre}</h3>
                  <ul className={styles.modulePoints}>
                    {m.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* Pédagogie + évaluation */}
          <div className={styles.twoCol}>
            <Reveal className={styles.panel}>
              <h3 className={styles.h3}>Modalités pédagogiques</h3>
              <ul className={styles.bullets}>
                {programme.pedagogie.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className={styles.panel} delay={60}>
              <h3 className={styles.h3}>Modalités d&rsquo;évaluation</h3>
              <ul className={styles.bullets}>
                {programme.evaluation.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Infos pratiques */}
          <h2 className={styles.h2}>Informations pratiques</h2>
          <dl className={styles.infos}>
            {infos.map((info) => (
              <Reveal key={info.label} as="div" className={styles.infoRow}>
                <dt>{info.label}</dt>
                <dd>{info.value}</dd>
              </Reveal>
            ))}
          </dl>

          {/* CTA */}
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaTitle}>Prêt à lancer votre projet ?</h2>
            <p>
              Réservez votre place gratuitement. On vous rappelle sous 24h pour
              cadrer votre projet et préparer votre financement.
            </p>
            <div className={styles.ctaButtons}>
              <Button href="/inscription" variant="gold" size="lg" arrow>
                S&rsquo;inscrire gratuitement
              </Button>
              <Button href="/financement" variant="outline" size="lg">
                Voir le financement
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
