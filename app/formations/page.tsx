import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { formations } from "@/lib/content";
import styles from "./formations.module.css";

export const metadata: Metadata = {
  title: "Formations",
  description:
    "Le catalogue des formations [Shift] Académie. Des parcours concrets pour créer, lancer et développer votre activité. Organisme certifié Qualiopi.",
};

export default function FormationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos formations"
        title="Le catalogue de formations"
        lead="Des parcours concrets, pensés pour les professionnels de terrain. Chaque formation est éligible à un financement et donne lieu à une attestation."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Formations" }]}
      />

      <div className="section">
        <div className="container">
          <ul className={styles.grid}>
            {formations.map((f, i) => (
              <Reveal
                as="li"
                key={f.slug}
                className={`${styles.card} ${f.disponible ? "" : styles.soon}`}
                delay={i * 60}
              >
                <div className={styles.cardTop}>
                  <span
                    className={`${styles.status} ${
                      f.disponible ? styles.on : styles.off
                    }`}
                  >
                    {f.disponible ? "Disponible" : "Prochainement"}
                  </span>
                  <span className={styles.duree}>{f.duree}</span>
                </div>

                <h2 className={styles.cardTitle}>
                  {f.disponible && f.href ? (
                    <Link href={f.href}>{f.titre}</Link>
                  ) : (
                    f.titre
                  )}
                </h2>
                <p className={styles.accroche}>{f.accroche}</p>
                <p className={styles.resume}>{f.resume}</p>

                <ul className={styles.meta}>
                  {f.cpf && <li className="badge-cpf">Finançable CPF</li>}
                  {f.formats.map((fmt) => (
                    <li key={fmt} className="badge">
                      {fmt}
                    </li>
                  ))}
                  <li className="badge">{f.niveau}</li>
                </ul>

                <div className={styles.cardActions}>
                  {f.disponible && f.href ? (
                    <>
                      <Button href={f.href} variant="accent" arrow>
                        Voir la formation
                      </Button>
                      {f.pdf && (
                        <Button href={f.pdf} variant="ghost" download>
                          Programme PDF
                        </Button>
                      )}
                    </>
                  ) : f.href ? (
                    <>
                      <Button href={f.href} variant="accent" arrow>
                        Voir le programme
                      </Button>
                      <span className={styles.soonNote}>
                        Inscriptions bientôt
                      </span>
                    </>
                  ) : (
                    <span className={styles.soonNote}>
                      Ouverture des inscriptions bientôt
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>

          {/* Bandeau confiance / contact */}
          <Reveal className={styles.banner}>
            <div>
              <h2 className={styles.bannerTitle}>
                Une question sur nos formations ?
              </h2>
              <p>
                Organisme certifié Qualiopi. On vous rappelle sous 24h pour
                cadrer votre projet et votre financement.
              </p>
            </div>
            <Button href="/inscription" variant="gold" size="lg" arrow>
              Être recontacté
            </Button>
          </Reveal>
        </div>
      </div>
    </>
  );
}
