import Link from "next/link";
import styles from "./Logo.module.css";

export default function Logo({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href="/"
      className={`${styles.logo} ${tone === "dark" ? styles.dark : ""}`}
      aria-label="[Shift] Académie — Accueil"
    >
      <span className={styles.mark}>
        <span className={styles.bracket}>[</span>
        <span className={styles.name}>Shift</span>
        <span className={styles.bracket}>]</span>
      </span>
      <span className={styles.sub}>Académie</span>
    </Link>
  );
}
