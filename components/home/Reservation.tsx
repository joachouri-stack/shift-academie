"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import styles from "./Reservation.module.css";

const reservationBadges = ["Qualiopi", "Constructys", "RS6776"];

type Status = "idle" | "loading" | "success" | "error";

export default function Reservation() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Une erreur est survenue.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer le formulaire. Réessayez."
      );
    }
  }

  return (
    <section className={styles.section} id="reservation" aria-labelledby="resa-title">
      <div className={`container ${styles.inner}`}>
        {/* Colonne info */}
        <Reveal className={styles.aside}>
          <span className="eyebrow">Réservation</span>
          <h2 id="resa-title" className={styles.title}>
            Réservez votre place — gratuitement.
          </h2>
          <p className={styles.text}>
            Remplissez ce formulaire — on vous rappelle sous 24h pour cadrer
            votre projet et monter le dossier Constructys avec vous. Sans
            engagement, sans surprise.
          </p>

          <ul className={styles.badges}>
            {reservationBadges.map((b) => (
              <li key={b}>
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path
                    d="M3.5 8.5l3 3 6-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Formulaire */}
        <Reveal className={styles.formCard} delay={80}>
          {status === "success" ? (
            <div className={styles.success} role="status">
              <span className={styles.successIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3>Demande bien reçue !</h3>
              <p>
                Merci. On vous rappelle sous 24h pour cadrer votre projet et
                préparer votre dossier Constructys.
              </p>
              <Button onClick={() => setStatus("idle")} variant="outline">
                Envoyer une autre demande
              </Button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Honeypot anti-spam — caché aux humains */}
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="company_website">Ne pas remplir</label>
                <input
                  type="text"
                  id="company_website"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className={styles.row}>
                <Field label="Prénom" name="prenom" autoComplete="given-name" required />
                <Field label="Nom" name="nom" autoComplete="family-name" required />
              </div>

              <Field
                label="Métier / Entreprise"
                name="metier"
                placeholder="ex. Plombier — Dupont SARL"
                required
              />

              <div className={styles.field}>
                <label htmlFor="nombre">Nombre à former</label>
                <select id="nombre" name="nombre" defaultValue="Moi seul·e">
                  <option>Moi seul·e</option>
                  <option>2 à 5 personnes</option>
                  <option>6 à 10 personnes</option>
                  <option>Plus de 10 personnes</option>
                </select>
              </div>

              <div className={styles.row}>
                <Field
                  label="Email professionnel"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <Field
                  label="Téléphone"
                  name="telephone"
                  type="tel"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="format">Format souhaité</label>
                  <select id="format" name="format" defaultValue="Présentiel — Orange">
                    <option>Présentiel — Orange</option>
                    <option>Distanciel</option>
                    <option>Indifférent</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="periode">Période souhaitée</label>
                  <select
                    id="periode"
                    name="periode"
                    defaultValue="Le plus tôt possible"
                  >
                    <option>Le plus tôt possible</option>
                    <option>Sous 4-6 semaines</option>
                    <option>À définir ensemble</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="message">
                  Message <span className={styles.optional}>(optionnel)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Vos questions, votre contexte, vos contraintes…"
                />
              </div>

              <label className={styles.consent}>
                <input type="checkbox" name="consent" required />
                <span>
                  J&rsquo;accepte que mes données soient utilisées pour être
                  recontacté·e. Voir notre{" "}
                  <a href="/confidentialite">politique de confidentialité</a>.
                </span>
              </label>

              {status === "error" && (
                <p className={styles.error} role="alert">
                  {errorMsg}
                </p>
              )}

              <Button
                type="submit"
                variant="accent"
                size="lg"
                arrow
                fullWidth
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "Envoi en cours…"
                  : "Recevoir mon dossier Constructys"}
              </Button>

              <p className={styles.reassure}>
                Réponse sous 24h · Sans engagement · Données protégées RGPD
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={name}>
        {label}
        {required && <span className={styles.req} aria-hidden="true"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
}
