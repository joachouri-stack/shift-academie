import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import styles from "./connexion.module.css";

export const metadata: Metadata = {
  title: "Connexion — Espace apprenant",
  description:
    "Connectez-vous à votre espace apprenant [Shift] Académie pour suivre votre formation à distance.",
};

export default function ConnexionPage() {
  return (
    <>
      <PageHero
        eyebrow="Espace apprenant"
        title="Se connecter"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Connexion" }]}
      />

      <section className="section">
        <div className="container container-narrow">
          <div className={styles.notice}>
            <span className={styles.noticeIcon} aria-hidden="true">
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
            <p>
              L&rsquo;espace apprenant pour les formations à distance ouvre
              prochainement. En attendant, réservez votre place — on vous
              accompagne personnellement.
            </p>
          </div>

          {/* Aperçu de l'interface de connexion (activée au lancement du distanciel) */}
          <form className={styles.form} aria-label="Connexion (bientôt disponible)">
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.fr"
                autoComplete="email"
                disabled
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled
              />
            </div>
            <Button variant="primary" size="lg" fullWidth disabled>
              Se connecter (bientôt)
            </Button>
          </form>

          <div className={styles.alt}>
            <p>Vous souhaitez vous former dès maintenant ?</p>
            <Button href="/inscription" variant="gold" arrow>
              Réserver ma place
            </Button>
            <p className={styles.small}>
              Pas encore de compte ? L&rsquo;inscription en ligne arrive avec
              l&rsquo;espace apprenant.{" "}
              <Link href="/inscription">Réservez en attendant</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
