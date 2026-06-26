import Link from "next/link";
import styles from "./Logo.module.css";

type LogoProps = {
  tone?: "light" | "dark";
  /** Mot placé AVANT « Shift » (ex. "Johane"). */
  prefix?: string;
  /** Mot placé APRÈS « Shift » (ex. "Académie", "Office"). */
  suffix?: string;
  /** Lien de destination (par défaut l'accueil). */
  href?: string;
};

/**
 * Wordmark premium de la famille « Shift ».
 * Réutilisable sur les 3 marques : Shift Académie, Shift Office, Johane Shift.
 * - « [Shift] » porte la couleur signature (--logo-accent).
 * - Le qualificatif (Académie / Office / Johane) est neutre, en petites capitales espacées.
 */
export default function Logo({
  tone = "light",
  prefix,
  suffix = "Académie",
  href = "/",
}: LogoProps) {
  const aria = [prefix, "Shift", suffix].filter(Boolean).join(" ");

  return (
    <Link
      href={href}
      className={`${styles.logo} ${tone === "dark" ? styles.dark : ""}`}
      aria-label={`${aria} — Accueil`}
    >
      {prefix && (
        <>
          <span className={styles.qualifier}>{prefix}</span>
          <span className={styles.divider} aria-hidden="true" />
        </>
      )}

      <span className={styles.mark}>
        <span className={styles.bracket}>[</span>
        <span className={styles.name}>Shift</span>
        <span className={styles.bracket}>]</span>
      </span>

      {suffix && (
        <>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.qualifier}>{suffix}</span>
        </>
      )}
    </Link>
  );
}
