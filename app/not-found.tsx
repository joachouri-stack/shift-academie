import Link from "next/link";
import Button from "@/components/ui/Button";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <div className="container">
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Cette page n&rsquo;existe pas.</h1>
        <p className={styles.text}>
          Le lien est peut-être erroné ou la page a été déplacée. Revenons en
          terrain connu.
        </p>
        <div className={styles.actions}>
          <Button href="/" variant="primary" arrow>
            Retour à l&rsquo;accueil
          </Button>
          <Link href="/programme" className={styles.link}>
            Voir le programme
          </Link>
        </div>
      </div>
    </section>
  );
}
