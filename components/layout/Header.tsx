"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import { nav } from "@/lib/content";
import styles from "./Header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
          <Button href="/inscription" variant="primary" size="sm" arrow>
            S&rsquo;inscrire
          </Button>
        </div>

        <button
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
          <Button
            href="/inscription"
            variant="primary"
            size="lg"
            arrow
            fullWidth
            className={styles.mobileCta}
          >
            S&rsquo;inscrire
          </Button>
          <Link href="/connexion" className={styles.mobileSecondary}>
            Se connecter
          </Link>
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
