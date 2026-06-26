import Reveal from "@/components/ui/Reveal";
import Avatar from "@/components/ui/Avatar";
import { fondateur } from "@/lib/content";
import styles from "./Fondateur.module.css";

export default function Fondateur() {
  return (
    <section className={styles.section} id="a-propos" aria-labelledby="fond-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.left}>
          <span className={styles.eyebrow}>À propos</span>
          <h2 id="fond-title" className={styles.name}>
            {fondateur.nom}
          </h2>
          <p className={styles.baseline}>{fondateur.baseline}</p>
          <p className={styles.text}>{fondateur.texte}</p>

          <p className={styles.valeurs}>
            {fondateur.valeurs.map((v, i) => (
              <span key={v}>
                {v}
                {i < fondateur.valeurs.length - 1 && (
                  <span className={styles.dot} aria-hidden="true">
                    ·
                  </span>
                )}
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal className={styles.right} delay={80}>
          {/* Carte profil — l'image réelle remplacera le placeholder */}
          <div className={styles.profile}>
            <Avatar
              src="/assets/johane-achouri.jpg"
              alt={fondateur.nom}
              initials={fondateur.initiales}
              className={styles.avatar}
              initialsClassName={styles.initiales}
            />
            <div>
              <p className={styles.profileName}>{fondateur.nom}</p>
              <p className={styles.profileRole}>{fondateur.role}</p>
            </div>
          </div>

          <ul className={styles.blocks}>
            {fondateur.expertises.map((e) => (
              <li key={e.label} className={styles.block}>
                <span className={styles.blockLabel}>{e.label}</span>
                <span className={styles.blockTitle}>{e.titre}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
