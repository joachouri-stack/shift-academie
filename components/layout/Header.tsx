"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import { logoutAction } from "@/app/connexion/actions";
import { nav } from "@/lib/content";
import styles from "./Header.module.css";

type Me = { firstName: string; role: string } | null;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // undefined = pas encore connu, null = déconnecté, objet = connecté.
  const [me, setMe] = useState<Me | undefined>(undefined);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Ombre/fond renforcés au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu au changement de route
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // État de connexion (rafraîchi à chaque changement de route pour refléter
  // une connexion / déconnexion sans rechargement complet).
  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => {
        if (alive) setMe(d.user ?? null);
      })
      .catch(() => {
        if (alive) setMe(null);
      });
    return () => {
      alive = false;
    };
  }, [pathname]);

  const espaceHref = me?.role === "admin" ? "/admin" : "/espace";

  // Bloque le scroll body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Échap pour fermer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Piège le focus dans le menu mobile ouvert, restaure le focus à la fermeture
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )
      );

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKey);
    return () => {
      panel.removeEventListener("keydown", onKey);
      burgerRef.current?.focus();
    };
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.bar}`}>
        <Logo />

        <nav className={styles.desktopNav} aria-label="Navigation principale">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${active ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          {me ? (
            <>
              <Link href={espaceHref} className={styles.link}>
                Mon espace
              </Link>
              <form action={logoutAction}>
                <button type="submit" className={styles.logoutBtn}>
                  Se déconnecter
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/connexion" className={styles.link}>
                Se connecter
              </Link>
              <Button href="/inscription" variant="primary" size="sm" arrow>
                S&rsquo;inscrire
              </Button>
            </>
          )}
        </div>

        <button
          ref={burgerRef}
          className={styles.burger}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.burgerLine} ${open ? styles.b1 : ""}`} />
          <span className={`${styles.burgerLine} ${open ? styles.b2 : ""}`} />
          <span className={`${styles.burgerLine} ${open ? styles.b3 : ""}`} />
        </button>
      </div>

      {/* Menu mobile */}
      <div
        ref={panelRef}
        id="menu-mobile"
        className={`${styles.mobilePanel} ${open ? styles.panelOpen : ""}`}
        hidden={!open}
      >
        <nav className={styles.mobileNav} aria-label="Navigation mobile">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileLink} ${active ? styles.active : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          {me ? (
            <>
              <Button
                href={espaceHref}
                variant="primary"
                size="lg"
                arrow
                fullWidth
                className={styles.mobileCta}
                onClick={() => setOpen(false)}
              >
                Mon espace
              </Button>
              <form action={logoutAction} className={styles.mobileLogoutForm}>
                <button type="submit" className={styles.mobileSecondary}>
                  Se déconnecter
                </button>
              </form>
            </>
          ) : (
            <>
              <Button
                href="/inscription"
                variant="primary"
                size="lg"
                arrow
                fullWidth
                className={styles.mobileCta}
                onClick={() => setOpen(false)}
              >
                S&rsquo;inscrire
              </Button>
              <Link
                href="/connexion"
                className={styles.mobileSecondary}
                onClick={() => setOpen(false)}
              >
                Se connecter
              </Link>
            </>
          )}
        </nav>
      </div>

      <button
        className={`${styles.scrim} ${open ? styles.scrimOpen : ""}`}
        aria-hidden={!open}
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />
    </header>
  );
}
