import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Formation from "@/components/home/Formation";
import Qualiopi from "@/components/home/Qualiopi";
import Financeurs from "@/components/home/Financeurs";
import Indicateurs from "@/components/home/Indicateurs";
import Fondateur from "@/components/home/Fondateur";
import Temoignages from "@/components/home/Temoignages";
import Accessibilite from "@/components/home/Accessibilite";
import Reservation from "@/components/home/Reservation";
import Faq from "@/components/home/Faq";
import { site, faq } from "@/lib/content";

// Canonical propre à l'accueil (les autres pages s'auto-canonicalisent sur leur URL).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/icon.png`,
      image: `${site.url}/og.png`,
      email: site.email,
      telephone: "+33783915050",
      description: site.description,
      address: {
        "@type": "PostalAddress",
        addressCountry: "FR",
      },
      areaServed: "FR",
    },
    {
      "@type": "Course",
      name: "Créer son entreprise",
      url: `${site.url}/formations/creer-son-entreprise`,
      description:
        "Formation à la création d'entreprise (14h, 2 jours) : principes fondamentaux, cadre juridique et fiscal, bases économiques et financières, développement et pérennisation.",
      provider: {
        "@type": "EducationalOrganization",
        name: site.name,
        url: site.url,
      },
      educationalCredentialAwarded: "Certification RS6776",
      hasCourseInstance: [
        {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseWorkload: "PT14H",
          location: {
            "@type": "VirtualLocation",
            url: site.url,
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Formation />
      <Qualiopi />
      <Financeurs />
      <Indicateurs />
      <Fondateur />
      <Temoignages />
      <Accessibilite />
      <Reservation />
      <Faq />
    </>
  );
}
