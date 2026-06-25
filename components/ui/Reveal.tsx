"use client";

import { createElement, useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  as?: React.ElementType;
  delay?: number;
  className?: string;
};

/**
 * Révèle son contenu à l'entrée dans le viewport.
 * - Aucun layout shift : l'élément occupe sa place dès le départ (opacity/transform only).
 * - Respecte prefers-reduced-motion (géré en CSS via [data-reveal]).
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return createElement(
    Tag,
    {
      ref,
      "data-reveal": "",
      className: `${visible ? "is-visible" : ""} ${className}`.trim(),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children
  );
}
