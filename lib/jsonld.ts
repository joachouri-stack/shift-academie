import { site, type Formation } from "./content";

/**
 * Données structurées schema.org (JSON-LD).
 *
 * `courseJsonLd` génère automatiquement le balisage « Course » d'une formation
 * à partir de ses données (lib/content.ts). Toute formation qui utilise ce
 * helper obtient son JSON-LD sans configuration supplémentaire, et il reste
 * cohérent avec le contenu (titre, description, durée, certification…).
 */

/** Convertit une durée FR ("14 heures (2 jours)") en ISO 8601 ("PT14H"). */
function toIsoDuration(duree?: string): string | undefined {
  if (!duree) return undefined;
  const hours = parseInt(duree, 10);
  return Number.isFinite(hours) && hours > 0 ? `PT${hours}H` : undefined;
}

export function courseJsonLd(formation: Formation) {
  const workload = toIsoDuration(formation.duree);

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: formation.titre,
    description: formation.resume ?? formation.accroche ?? formation.titre,
    url: `${site.url}${formation.href ?? ""}`,
    provider: {
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.url,
    },
    ...(formation.certification
      ? { educationalCredentialAwarded: formation.certification }
      : {}),
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "Online",
        ...(workload ? { courseWorkload: workload } : {}),
        location: { "@type": "VirtualLocation", url: site.url },
      },
    ],
  };
}
