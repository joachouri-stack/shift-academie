import Link from "next/link";
import Logo from "./Logo";
import { site, nav } from "@/lib/content";
import styles from "./Footer.module.css";

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "Conditions générales", href: "/cgv" },
];

const espaceLinks = [
  { label: "S'inscrire", href: "/inscription" },
  { label: "Se connecter", href: "/connexion" },
];

export default function Footer() {
  const year = 2025;
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo tone="dark" />
            <p className={styles.tagline}>{site.baseline}</p>
            <p className={styles.org}>
              Organisme de formation certifié Qualiopi.
            </p>
          </div>

          <nav className={styles.col} aria-label="Navigation">
            <h3 className={styles.colTitle}>Navigation</h3>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Espace">
            <h3 className={styles.colTitle}>Espace apprenant</h3>
            <ul>
              {espaceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Contact</h3>
            <ul>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li className={styles.muted}>{site.city}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} {site.name}. Tous droits réservés.
          </p>
          <ul className={styles.legal}>
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
