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
    "Programme détaillé (14h, 2 jours) : créer, lancer et développer une activité indépendante grâce à l'IA. Objectifs, modules, outils, financement et accessibilité.",
};

const facts = [
  { label: "Durée", value: programme.duree },
  { label: "Format", value: programme.format },
  { label: "Niveau", value: "Aucun prérequis en IA" },
  { label: "À la clé", value: "Attestation de fin de formation" },
];

const infos = [
  { label: "Durée", value: programme.duree },
  { label: "Format", value: programme.format },
  { label: "Accessibilité handicap", value: programme.accessibilite },
  { label: "Validation", value: programme.validation },
  { label: "Financement possible", value: programme.financement },
];

function CheckList({
  items,
  variant = "check",
}: {
  items: readonly string[];
  variant?: "check" | "dot";
}) {
  if (variant === "dot") {
    return (
      <ul className={styles.bullets}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    );
  }
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

export default function ProgrammePage() {
  return (
    <>
      <PageHero
        eyebrow="Programme · 14 h"
        title={programme.titre}
        lead={`${programme.titreLong}. ${programme.intro}`}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Programme" }]}
      />

      <div className="section">
        <div className="container">
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

          {/* Objectifs */}
          <Reveal className={styles.block}>
            <h2 className={styles.h2}>Objectifs de la formation</h2>
            <p className="lead">
              À l&rsquo;issue de la formation, le participant sera capable de :
            </p>
            <CheckList items={programme.objectifs} />
          </Reveal>

          {/* Public + Prérequis */}
          <div className={styles.twoCol}>
            <Reveal className={styles.panel}>
              <h3 className={styles.h3}>Public concerné</h3>
              <ul className={styles.chips}>
                {programme.public.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className={styles.panel} delay={60}>
              <h3 className={styles.h3}>Prérequis</h3>
              <CheckList items={programme.prerequis} variant="dot" />
            </Reveal>
          </div>

          {/* Modules par jour */}
          <div className={styles.block}>
            <h2 className={styles.h2}>Le déroulé, module par module</h2>
            <p className="lead">
              Deux journées, dix modules : de la structuration du projet
              jusqu&rsquo;à vos premiers clients.
            </p>
          </div>

          {programme.jours.map((jour, ji) => (
            <section key={jour.label} className={styles.jour}>
              <Reveal className={styles.jourHead}>
                <span className={styles.jourLabel}>{jour.label}</span>
                <h3 className={styles.jourTitle}>{jour.titre}</h3>
                <span className={styles.jourDuree}>{jour.duree}</span>
              </Reveal>

              <ol className={styles.modules}>
                {jour.modules.map((m, i) => (
                  <Reveal
                    key={m.num}
                    as="li"
                    className={styles.module}
                    delay={i * 40}
                  >
                    <div className={styles.moduleHead}>
                      <span className={styles.moduleNum}>{m.num}</span>
                      <h4 className={styles.moduleTitle}>{m.titre}</h4>
                    </div>

                    <div className={styles.moduleBody}>
                      {m.objectifs && (
                        <div className={styles.moduleGroup}>
                          <span className={styles.groupLabel}>Objectifs</span>
                          <CheckList items={m.objectifs} variant="dot" />
                        </div>
                      )}

                      <div className={styles.moduleGroup}>
                        <span className={styles.groupLabel}>
                          {m.contenuTitre ?? "Contenu"}
                        </span>
                        <CheckList items={m.contenu} variant="dot" />
                      </div>

                      {m.casPratiques && (
                        <div className={styles.moduleGroup}>
                          <span className={styles.groupLabel}>
                            {m.casPratiquesTitre ?? "Cas pratiques"}
                          </span>
                          <CheckList items={m.casPratiques} variant="dot" />
                        </div>
                      )}

                      {m.outils && (
                        <div className={styles.outils}>
                          <span className={styles.groupLabel}>Outils</span>
                          <ul className={styles.outilsList}>
                            {m.outils.map((o) => (
                              <li key={o}>{o}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </ol>
              {ji === 0 && <div className={styles.jourSep} aria-hidden="true" />}
            </section>
          ))}

          {/* Pédagogie + Moyens */}
          <div className={styles.twoCol}>
            <Reveal className={styles.panel}>
              <h3 className={styles.h3}>Méthodes pédagogiques</h3>
              <CheckList items={programme.pedagogie} variant="dot" />
            </Reveal>
            <Reveal className={styles.panel} delay={60}>
              <h3 className={styles.h3}>Moyens pédagogiques</h3>
              <CheckList items={programme.moyens} variant="dot" />
            </Reveal>
          </div>

          {/* Évaluation + Suivi */}
          <div className={styles.twoCol}>
            <Reveal className={styles.panel}>
              <h3 className={styles.h3}>Modalités d&rsquo;évaluation</h3>
              <CheckList items={programme.evaluation} variant="dot" />
            </Reveal>
            <Reveal className={styles.panel} delay={60}>
              <h3 className={styles.h3}>Modalités de suivi</h3>
              <CheckList items={programme.suivi} variant="dot" />
            </Reveal>
          </div>

          {/* Documents remis */}
          <Reveal className={styles.block}>
            <h2 className={styles.h2}>Documents remis aux participants</h2>
            <CheckList items={programme.documents} />
          </Reveal>

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
