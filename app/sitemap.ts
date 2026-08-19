import type { MetadataRoute } from "next";
import { site, formations } from "@/lib/content";

/**
 * Sitemap généré automatiquement (Next.js Metadata Route) → /sitemap.xml
 *
 * - Contient uniquement des URLs publiques, indexables et canoniques.
 * - Les fiches formations sont dérivées de `formations` (lib/content.ts) :
 *   toute nouvelle formation publiée y est ajoutée automatiquement.
 * - Exclus volontairement :
 *     • /admin, /admin/*, /espace, /connexion, /api/*  → privé / technique (noindex ou bloqué par robots.txt)
 *     • /programme                                     → redirection vers la fiche formation
 *     • /mentions-legales, /confidentialite, /cgv      → pages juridiques, faible intérêt SEO
 *       (elles restent accessibles et indexables, mais hors sitemap)
 * - Pas de `lastmod` : aucune date de modification fiable par page (pas de CMS).
 * - Pas de `changefreq` ni `priority` : ignorés par Google, aucune utilité réelle ici.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "", // accueil
    "/formations",
    "/financement",
    "/a-propos",
    "/inscription",
  ];

  // Dérivé du contenu : ajoute automatiquement toute future formation publiée.
  const formationRoutes = formations
    .map((f) => f.href)
    .filter((href): href is string => Boolean(href));

  const paths = Array.from(new Set([...staticRoutes, ...formationRoutes]));

  // Next.js normalise l'URL racine avec un slash final (https://shift-academie.fr/).
  // Équivalent strict à la canonical du domaine racine pour les moteurs de recherche.
  return paths.map((path) => ({
    url: `${site.url}${path}`,
  }));
}
