import styles from "./Prose.module.css";

export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <section className="section">
      <div className="container container-narrow">
        <div className={styles.prose}>{children}</div>
      </div>
    </section>
  );
}
