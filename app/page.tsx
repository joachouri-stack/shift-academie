import Hero from "@/components/home/Hero";
import Formation from "@/components/home/Formation";
import Qualiopi from "@/components/home/Qualiopi";
import Indicateurs from "@/components/home/Indicateurs";
import Fondateur from "@/components/home/Fondateur";
import Temoignages from "@/components/home/Temoignages";
import Accessibilite from "@/components/home/Accessibilite";
import Reservation from "@/components/home/Reservation";
import Faq from "@/components/home/Faq";
import { site, faq } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.url,
      email: site.email,
      telephone: site.phone,
      description: site.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressCountry: "FR",
      },
    },
    {
      "@type": "Course",
      name: "Créer son entreprise",
      description:
        "Formation pour créer, lancer et développer son activité à l'aide d'outils d'intelligence artificielle simples et concrets.",
      provider: {
        "@type": "EducationalOrganization",
        name: site.name,
        url: site.url,
      },
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
      <Indicateurs />
      <Fondateur />
      <Temoignages />
      <Accessibilite />
      <Reservation />
      <Faq />
    </>
  );
}
