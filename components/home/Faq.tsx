"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { faq, site } from "@/lib/content";
import styles from "./Faq.module.css";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="container container-narrow">
        <SectionHeader
          align="center"
          eyebrow="Questions fréquentes"
          title="Toutes vos questions — réponses honnêtes."
          lead="Pas de langue de bois. Si vous ne trouvez pas votre réponse ici, posez-la directement par téléphone ou via le formulaire — réponse sous 24h."
        />

        <Reveal className={styles.list}>
          {faq.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div
                key={item.q}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
              >
                <h3 className={styles.qWrap}>
                  <button
                    id={btnId}
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className={styles.icon} aria-hidden="true">
                      <span className={styles.iconBar} />
                      <span className={`${styles.iconBar} ${styles.iconBarV}`} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={styles.panel}
                >
                  <div className={styles.panelInner}>
                    <p className={styles.answer}>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>

        <Reveal className={styles.cta}>
          <p>Une autre question ?</p>
          <div className={styles.ctaButtons}>
            <Button href={`tel:${site.phone.replace(/\s/g, "")}`} variant="outline">
              {site.phoneDisplay}
            </Button>
            <Button href="/inscription" variant="primary" arrow>
              Poser ma question
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
