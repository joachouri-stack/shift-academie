import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de [Shift] Académie.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero
        eyebrow="Informations légales"
        title="Mentions légales"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Mentions légales" },
        ]}
      />
      <Prose>
        <p>
          <em>
            Document à finaliser avec vos informations légales définitives. Les
            mentions ci-dessous constituent une base ; complétez les champs
            signalés en <span className="placeholder">orange</span>.
          </em>
        </p>

        <h2>Éditeur du site</h2>
        <p>
          {site.name}
          <br />
          Statut juridique :{" "}
          <span className="placeholder">[forme juridique — ex. SAS / EI]</span>
          <br />
          Capital social :{" "}
          <span className="placeholder">[le cas échéant]</span>
          <br />
          Siège social :{" "}
          <span className="placeholder">[adresse complète]</span>
          <br />
          SIRET : {site.siret}
          <br />
          Code APE / NAF : {site.naf} — {site.nafLabel}
          <br />
          Numéro de TVA :{" "}
          <span className="placeholder">[numéro TVA intracommunautaire]</span>
          <br />
          Directeur de la publication : {site.founder}
          <br />
          Email : <a href={`mailto:${site.email}`}>{site.email}</a>
          <br />
          Téléphone : {site.phoneDisplay}
        </p>

        <h2>Déclaration d&rsquo;activité (organisme de formation)</h2>
        <p>
          Numéro de déclaration d&rsquo;activité :{" "}
          <span className="placeholder">[numéro NDA]</span> auprès de la Préfecture
          de <span className="placeholder">[région]</span>. Cet enregistrement ne
          vaut pas agrément de l&rsquo;État.
          <br />
          Certification Qualiopi délivrée au titre de la catégorie : actions de
          formation.
        </p>

        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par{" "}
          <span className="placeholder">[nom de l&rsquo;hébergeur]</span>,{" "}
          <span className="placeholder">[adresse de l&rsquo;hébergeur]</span>.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&rsquo;ensemble des contenus présents sur ce site (textes, visuels,
          logo, supports de formation) est la propriété de {site.name}, sauf
          mention contraire. Toute reproduction, représentation ou diffusion,
          totale ou partielle, sans autorisation préalable est interdite.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Le traitement de vos données personnelles est décrit dans notre{" "}
          <a href="/confidentialite">politique de confidentialité</a>.
        </p>

        <h2>Cookies</h2>
        <p>
          Ce site utilise uniquement les cookies strictement nécessaires à son
          bon fonctionnement. Aucun cookie de suivi publicitaire n&rsquo;est
          déposé sans votre consentement.
        </p>
      </Prose>
    </>
  );
}
