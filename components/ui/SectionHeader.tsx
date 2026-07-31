import Reveal from "./Reveal";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  titleId?: string;
  lead?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export default function SectionHeader({
  eyebrow,
  title,
  titleId,
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
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {lead && <p className={`lead ${styles.lead}`}>{lead}</p>}
    </Reveal>
  );
}
