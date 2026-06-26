"use client";

import { useState } from "react";

/**
 * Affiche une photo ; si le fichier est absent ou ne charge pas,
 * bascule automatiquement sur les initiales. Aucune image cassée.
 */
export default function Avatar({
  src,
  alt,
  initials,
  className,
  initialsClassName,
}: {
  src: string;
  alt: string;
  initials: string;
  className?: string;
  initialsClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={className}>
      {failed ? (
        <span className={initialsClassName} aria-hidden="true">
          {initials}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      )}
    </div>
  );
}
