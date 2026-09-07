import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import AuthForm from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Créer mon compte — Espace apprenant",
  description:
    "Créez votre compte [Shift] Académie pour accéder à votre espace apprenant, suivre votre formation à distance et votre progression.",
  alternates: { canonical: "/creer-un-compte" },
};

export default async function CreerComptePage() {
  const user = await getCurrentUser();
  if (user) redirect("/espace");

  return (
    <>
      <PageHero
        eyebrow="Espace apprenant"
        title="Créer mon compte"
        lead="Créez votre accès en une minute pour suivre votre formation à distance, votre progression et récupérer votre attestation."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Créer mon compte" },
        ]}
      />
      <section className="section">
        <div className="container">
          <AuthForm initialMode="register" />
          <p
            style={{
              textAlign: "center",
              marginTop: "var(--space-5)",
              color: "var(--text-muted)",
              fontSize: "var(--fs-sm)",
            }}
          >
            Vous avez déjà un compte ?{" "}
            <Link href="/connexion">Se connecter</Link>
          </p>
        </div>
      </section>
    </>
  );
}
