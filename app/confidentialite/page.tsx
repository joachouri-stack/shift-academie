import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles (RGPD) de [Shift] Académie.",
};

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero
        eyebrow="RGPD"
        title="Politique de confidentialité"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Confidentialité" },
        ]}
      />
      <Prose>
        <p>
          {site.name} attache une grande importance à la protection de vos
          données personnelles, conformément au Règlement Général sur la
          Protection des Données (RGPD) et à la loi Informatique et Libertés.
        </p>

        <h2>Responsable du traitement</h2>
        <p>
          Le responsable du traitement est {site.name}, représenté par{" "}
          {site.founder}. Contact :{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>Données collectées</h2>
        <p>
          Via notre formulaire de réservation, nous collectons : prénom, nom,
          métier / entreprise, nombre de personnes à former, email
          professionnel, téléphone, format souhaité, période souhaitée et votre
          éventuel message.
        </p>

        <h2>Finalités</h2>
        <ul>
          <li>Vous recontacter à la suite de votre demande.</li>
          <li>Cadrer votre projet de formation.</li>
          <li>Vous accompagner dans le montage d&rsquo;un dossier de financement.</li>
          <li>Assurer le suivi administratif et pédagogique des formations.</li>
        </ul>

        <h2>Base légale</h2>
        <p>
          Les traitements reposent sur votre consentement (formulaire de
          contact) et, le cas échéant, sur l&rsquo;exécution de mesures
          précontractuelles et contractuelles.
        </p>

        <h2>Durée de conservation</h2>
        <p>
          Vos données sont conservées le temps nécessaire au traitement de votre
          demande, puis archivées conformément aux obligations légales
          applicables aux organismes de formation, et au maximum{" "}
          <span className="placeholder">[durée — ex. 3 ans]</span> après le
          dernier contact, sauf obligation légale contraire.
        </p>

        <h2>Destinataires</h2>
        <p>
          Vos données sont destinées aux seules personnes habilitées de{" "}
          {site.name} et, le cas échéant, aux organismes financeurs concernés
          (par exemple Constructys) dans le cadre du montage de votre dossier.
          Elles ne sont jamais revendues.
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous disposez d&rsquo;un droit d&rsquo;accès, de rectification,
          d&rsquo;effacement, de limitation, d&rsquo;opposition et de portabilité
          de vos données. Pour les exercer, contactez-nous à{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. Vous pouvez
          également introduire une réclamation auprès de la CNIL
          (www.cnil.fr).
        </p>

        <h2>Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          appropriées pour protéger vos données contre tout accès non autorisé,
          perte ou altération.
        </p>

        <h2>Cookies</h2>
        <p>
          Ce site n&rsquo;utilise que les cookies strictement nécessaires à son
          fonctionnement. Aucun traceur publicitaire n&rsquo;est déposé sans
          consentement.
        </p>
      </Prose>
    </>
  );
}
