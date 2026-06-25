import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Conditions générales",
  description:
    "Conditions générales de vente et de prestation de [Shift] Académie.",
};

export default function CgvPage() {
  return (
    <>
      <PageHero
        eyebrow="Conditions"
        title="Conditions générales"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Conditions générales" }]}
      />
      <Prose>
        <p>
          <em>
            Base de conditions générales à finaliser avec votre conseil
            juridique. Complétez les champs signalés en{" "}
            <span className="placeholder">orange</span>.
          </em>
        </p>

        <h2>1. Objet</h2>
        <p>
          Les présentes conditions régissent les relations entre {site.name},
          organisme de formation, et toute personne physique ou morale
          (le « Client ») souhaitant bénéficier d&rsquo;une formation.
        </p>

        <h2>2. Inscription</h2>
        <p>
          La demande de réservation s&rsquo;effectue via le formulaire en ligne
          ou par téléphone. Elle est suivie d&rsquo;un échange permettant de
          cadrer le projet. L&rsquo;inscription est confirmée après signature de
          la convention ou du contrat de formation et, le cas échéant,
          validation du financement.
        </p>

        <h2>3. Tarifs</h2>
        <p>
          Les tarifs sont communiqués sur devis, en fonction du format
          (présentiel ou distanciel) et du nombre de participants. Tarif en
          vigueur : <span className="placeholder">[à préciser sur devis]</span>.
        </p>

        <h2>4. Financement</h2>
        <p>
          La formation peut faire l&rsquo;objet d&rsquo;une prise en charge
          (notamment via Constructys). La prise en charge dépend de votre
          situation et des critères de l&rsquo;organisme financeur. {site.name}{" "}
          accompagne le Client dans le montage du dossier mais ne garantit pas
          l&rsquo;obtention du financement.
        </p>

        <h2>5. Modalités de réalisation</h2>
        <p>
          Les modalités (dates, lieu, durée, format) sont précisées dans la
          convention de formation. Les formations sont dispensées en présentiel
          à {site.city} et/ou à distance via l&rsquo;espace apprenant.
        </p>

        <h2>6. Droit de rétractation et annulation</h2>
        <p>
          Le Client particulier dispose, le cas échéant, d&rsquo;un délai de
          rétractation conformément au Code de la consommation. Les conditions
          d&rsquo;annulation et de report sont précisées dans la convention :{" "}
          <span className="placeholder">[préciser les délais et conditions]</span>.
        </p>

        <h2>7. Accessibilité handicap</h2>
        <p>
          Les formations sont accessibles aux personnes en situation de
          handicap. Un référent dédié étudie chaque situation au cas par cas.
          Contactez-nous en amont à{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>8. Réclamations et médiation</h2>
        <p>
          Toute réclamation peut être adressée à{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. En cas de litige non
          résolu, le Client peut recourir à un médiateur de la consommation :{" "}
          <span className="placeholder">[coordonnées du médiateur]</span>.
        </p>

        <h2>9. Données personnelles</h2>
        <p>
          Le traitement des données est décrit dans la{" "}
          <a href="/confidentialite">politique de confidentialité</a>.
        </p>

        <h2>10. Droit applicable</h2>
        <p>
          Les présentes conditions sont soumises au droit français. Tout litige
          relève des tribunaux compétents.
        </p>
      </Prose>
    </>
  );
}
