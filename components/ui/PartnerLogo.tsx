"use client";

import { useState } from "react";

/**
 * Affiche le logo d'un partenaire ; si le fichier est absent,
 * bascule proprement sur le nom (aucune image cassée).
 */
export default function PartnerLogo({
  src,
  alt,
  className,
  fallbackClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className={fallbackClassName}>{alt}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
