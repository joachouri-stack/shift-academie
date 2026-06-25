import Reveal from "./Reveal";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export default function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
}: SectionHeaderProps) {
  return (
    <Reveal
      className={`${styles.head} ${align === "center" ? styles.center : ""} ${
        tone === "dark" ? styles.dark : ""
      }`}
    >
      {eyebrow && (
        <span className={`eyebrow ${align === "center" ? "eyebrow--center" : ""}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={styles.title}>{title}</h2>
      {lead && <p className={`lead ${styles.lead}`}>{lead}</p>}
    </Reveal>
  );
}
