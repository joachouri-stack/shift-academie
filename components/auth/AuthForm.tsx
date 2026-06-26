"use client";

import { useActionState, useState } from "react";
import Button from "@/components/ui/Button";
import { registerAction, loginAction } from "@/app/connexion/actions";
import styles from "./AuthForm.module.css";

type Mode = "login" | "register";

export default function AuthForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    undefined
  );
  const [regState, regFormAction, regPending] = useActionState(
    registerAction,
    undefined
  );

  return (
    <div className={styles.card}>
      <div className={styles.tabs} role="tablist" aria-label="Connexion ou inscription">
        <button
          role="tab"
          aria-selected={mode === "login"}
          className={`${styles.tab} ${mode === "login" ? styles.active : ""}`}
          onClick={() => setMode("login")}
        >
          Se connecter
        </button>
        <button
          role="tab"
          aria-selected={mode === "register"}
          className={`${styles.tab} ${mode === "register" ? styles.active : ""}`}
          onClick={() => setMode("register")}
        >
          Créer un compte
        </button>
      </div>

      {mode === "login" ? (
        <form className={styles.form} action={loginFormAction} key="login">
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <Field
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          {loginState?.error && (
            <p className={styles.error} role="alert">
              {loginState.error}
            </p>
          )}
          <Button type="submit" variant="accent" size="lg" fullWidth arrow disabled={loginPending}>
            {loginPending ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      ) : (
        <form className={styles.form} action={regFormAction} key="register">
          <div className={styles.row}>
            <Field label="Prénom" name="firstName" autoComplete="given-name" required />
            <Field label="Nom" name="lastName" autoComplete="family-name" required />
          </div>
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <Field
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="new-password"
            hint="Au moins 8 caractères."
            required
          />
          {regState?.error && (
            <p className={styles.error} role="alert">
              {regState.error}
            </p>
          )}
          <Button type="submit" variant="accent" size="lg" fullWidth arrow disabled={regPending}>
            {regPending ? "Création…" : "Créer mon compte"}
          </Button>
          <p className={styles.rgpd}>
            En créant un compte, vous acceptez notre{" "}
            <a href="/confidentialite">politique de confidentialité</a>.
          </p>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
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
        required={required}
        autoComplete={autoComplete}
        minLength={name === "password" ? 8 : undefined}
      />
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
