import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reservation from "@/components/home/Reservation";

export const metadata: Metadata = {
  title: "S'inscrire — Réservez votre place",
  description:
    "Réservez votre place gratuitement. On vous rappelle sous 24h pour cadrer votre projet et monter votre dossier de financement Constructys.",
};

export default function InscriptionPage() {
  return (
    <>
      <PageHero
        eyebrow="Inscription"
        title="Réservez votre place — gratuitement."
        lead="Remplissez le formulaire ci-dessous. On vous rappelle sous 24h pour cadrer votre projet, choisir le bon format et préparer votre financement. Sans engagement."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Inscription" }]}
      />
      <Reservation />
    </>
  );
}
