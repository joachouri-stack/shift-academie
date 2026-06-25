import styles from "./PageHero.module.css";

type Crumb = { label: string; href?: string };

export default function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumb,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  breadcrumb?: Crumb[];
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        {breadcrumb && (
          <nav aria-label="Fil d'Ariane" className={styles.crumbs}>
            {breadcrumb.map((c, i) => (
              <span key={c.label} className={styles.crumb}>
                {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
                {i < breadcrumb.length - 1 && (
                  <span className={styles.sep} aria-hidden="true">
                    /
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
    </section>
  );
}
