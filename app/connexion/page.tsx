import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import AuthForm from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion — Espace apprenant",
  description:
    "Connectez-vous ou créez votre compte pour accéder à votre espace apprenant [Shift] Académie.",
};

export default async function ConnexionPage() {
  const user = await getCurrentUser();
  if (user) redirect("/espace");

  return (
    <>
      <PageHero
        eyebrow="Espace apprenant"
        title="Connexion"
        lead="Connectez-vous à votre espace, ou créez votre compte pour suivre votre formation à distance."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Connexion" }]}
      />
      <section className="section">
        <div className="container">
          <AuthForm />
        </div>
      </section>
    </>
  );
}
