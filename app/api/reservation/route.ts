import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = Record<string, string>;

const required = ["prenom", "nom", "metier", "email", "telephone"];

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requête invalide." },
      { status: 400 }
    );
  }

  // Anti-spam : le honeypot doit rester vide.
  if (data.company_website && data.company_website.trim() !== "") {
    // On répond 200 pour ne pas informer le bot.
    return NextResponse.json({ ok: true });
  }

  // Validation des champs requis.
  const missing = required.filter((k) => !data[k] || data[k].trim() === "");
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, message: "Merci de remplir tous les champs obligatoires." },
      { status: 422 }
    );
  }

  if (!isEmail(data.email)) {
    return NextResponse.json(
      { ok: false, message: "L'adresse email semble invalide." },
      { status: 422 }
    );
  }

  if (data.consent !== "on") {
    return NextResponse.json(
      { ok: false, message: "Merci d'accepter l'utilisation de vos données." },
      { status: 422 }
    );
  }

  // TODO (jalon suivant) : envoi email (Resend/SMTP) + enregistrement en base.
  // Pour l'instant, on journalise côté serveur.
  const lead = {
    prenom: data.prenom,
    nom: data.nom,
    metier: data.metier,
    nombre: data.nombre,
    email: data.email,
    telephone: data.telephone,
    format: data.format,
    periode: data.periode,
    message: data.message ?? "",
  };
  console.info("[reservation] nouvelle demande:", lead);

  return NextResponse.json({ ok: true });
}
