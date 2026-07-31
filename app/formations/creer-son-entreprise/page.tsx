import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { BadgeRow } from "@/components/ui/Badge";
import { programme, badges, formations } from "@/lib/content";
import styles from "./detail.module.css";

const formation = formations.find((f) => f.slug === "creer-son-entreprise")!;

export const metadata: Metadata = {
  title: "Créer son entreprise — Formation",
  description:
    "Formation « Créer son entreprise » (14h, 2 jours) : principes fondamentaux, cadre juridique et fiscal, bases économiques et financières, développement et pérennisation. Programme détaillé à télécharger.",
};

const facts = [
  { label: "Durée", value: programme.duree },
  { label: "Format", value: programme.format },
  { label: "Niveau", value: "Aucun prérequis particulier" },
  { label: "À la clé", value: "Attestation de fin de formation" },
];

const infos = [
  { label: "Durée", value: programme.duree },
  { label: "Format", value: programme.format },
  { label: "Lieu de la formation", value: programme.lieu },
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

export default function FormationCreerEntreprisePage() {
  return (
    <>
      <PageHero
        eyebrow="Formation"
        title={formation.titre}
        lead={`${formation.accroche} — programme officiel : « ${programme.titre} ». ${programme.intro}`}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Formations", href: "/formations" },
          { label: formation.titre },
        ]}
      />

      <div className="section">
        <div className="container">
          {/* Actions principales */}
          <Reveal className={styles.actions}>
            <Button href="/inscription" variant="accent" size="lg" arrow>
              S&rsquo;inscrire gratuitement
            </Button>
            {formation.pdf && (
              <Button href={formation.pdf} variant="light" size="lg" download>
                <span className={styles.dlIcon} aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="18" height="18">
                    <path
                      d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M4 15.5h12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Télécharger le programme (PDF)
              </Button>
            )}
          </Reveal>

          {formation.cpf && (
            <Reveal as="p" className={styles.cpfNote}>
              <span className="badge-cpf">Finançable CPF</span>
              Formation éligible au financement via votre Compte Personnel de
              Formation.
            </Reveal>
          )}

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

          {/* Le déroulé — timeline Matin / Après-midi */}
          <div className={styles.block}>
            <h2 className={styles.h2}>Le déroulé de la formation</h2>
            <p className="lead">
              Deux journées rythmées, du matin à l&rsquo;après-midi : des
              principes fondamentaux jusqu&rsquo;à la pérennisation de votre
              entreprise.
            </p>
          </div>

          <div className={styles.timeline}>
            {programme.jours.map((jour) => (
              <section key={jour.label} className={styles.day}>
                <Reveal className={styles.dayHead}>
                  <span className={styles.dayBadge}>{jour.label}</span>
                  <h3 className={styles.dayTitle}>{jour.titre}</h3>
                  <span className={styles.dayDuree}>{jour.duree}</span>
                </Reveal>

                <div className={styles.moments}>
                  {jour.modules.map((m, i) => {
                    const startHour = parseInt(m.horaire ?? "0", 10);
                    const isMatin = startHour < 12;
                    const moment = isMatin ? "Matin" : "Après-midi";
                    return (
                      <Reveal
                        as="article"
                        key={m.num}
                        className={styles.moment}
                        delay={i * 70}
                      >
                        <div className={styles.momentRail} aria-hidden="true">
                          <span
                            className={`${styles.momentNode} ${
                              isMatin ? styles.momentNodeMatin : ""
                            }`}
                          >
                            <svg viewBox="0 0 24 24" width="15" height="15">
                              <circle
                                cx="12"
                                cy="12"
                                r="8.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.9"
                              />
                              <path
                                d="M12 7.5V12l3 2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>

                        <div className={styles.momentCard}>
                          <div className={styles.momentHead}>
                            <span
                              className={`${styles.momentTag} ${
                                isMatin ? styles.momentTagMatin : ""
                              }`}
                            >
                              {moment}
                            </span>
                            {m.horaire && (
                              <span className={styles.momentTime}>
                                {m.horaire} · {m.duree}
                              </span>
                            )}
                          </div>

                          <h4 className={styles.momentTitle}>{m.titre}</h4>

                          <ul className={styles.themes}>
                            {m.sections.map((sec) => (
                              <li key={sec.titre} className={styles.theme}>
                                <span
                                  className={styles.themeCheck}
                                  aria-hidden="true"
                                >
                                  <svg viewBox="0 0 16 16" width="13" height="13">
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
                                <span className={styles.themeText}>
                                  <span className={styles.themeName}>
                                    {sec.titre}
                                  </span>
                                  <span className={styles.themePoints}>
                                    {sec.points.join(" · ")}
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

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
              {formation.pdf && (
                <Button href={formation.pdf} variant="light" size="lg" download>
                  Télécharger le programme
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
