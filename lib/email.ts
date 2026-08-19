import "server-only";
import { Resend } from "resend";
import { site } from "./content";

/**
 * Notification e-mail d'une nouvelle inscription (via Resend).
 *
 * Piloté par variables d'environnement (aucun secret dans le code) :
 * - RESEND_API_KEY   : clé API Resend (obligatoire pour envoyer).
 * - LEAD_NOTIFY_TO   : adresse qui REÇOIT les inscriptions (défaut : site.email).
 * - LEAD_NOTIFY_FROM : expéditeur. Pour démarrer sans config DNS on utilise
 *   l'adresse de test Resend ; après vérification du domaine sur Resend, mettre
 *   par ex. "Shift Académie <notifications@shift-academie.fr>".
 *
 * L'envoi est « best-effort » : s'il échoue, l'inscription reste enregistrée en
 * base et la réponse au visiteur n'est pas impactée (voir la route).
 */

export type LeadPayload = {
  prenom: string;
  nom: string;
  metier?: string;
  nombre?: string;
  email: string;
  telephone?: string;
  periode?: string;
  message?: string;
};

const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || site.email;
const NOTIFY_FROM =
  process.env.LEAD_NOTIFY_FROM || "Shift Académie <onboarding@resend.dev>";

function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendLeadNotification(lead: LeadPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY absent — notification d'inscription non envoyée."
    );
    return;
  }

  const resend = new Resend(apiKey);
  const fullName = `${lead.prenom} ${lead.nom}`.trim();

  const rows: Array<[string, string | undefined]> = [
    ["Nom", fullName],
    ["Métier / Entreprise", lead.metier],
    ["Email", lead.email],
    ["Téléphone", lead.telephone],
    ["Nombre à former", lead.nombre],
    ["Période souhaitée", lead.periode],
    ["Message", lead.message],
  ];
  const filled = rows.filter(([, v]) => v && v.trim() !== "") as Array<
    [string, string]
  >;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a22;max-width:560px;">
      <p style="font-size:16px;font-weight:bold;margin:0 0 4px;">
        <span style="color:#ff6b2b;">[Shift]</span> Académie — Nouvelle inscription
      </p>
      <p style="color:#6b6b76;font-size:13px;margin:0 0 16px;">Reçue via le formulaire du site.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
        ${filled
          .map(
            ([k, v]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#6b6b76;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(
            k
          )}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">${esc(
            v
          )}</td>
        </tr>`
          )
          .join("")}
      </table>
      <p style="color:#6b6b76;font-size:12px;margin:16px 0 0;">
        Répondez directement à cet e-mail pour recontacter la personne.
      </p>
    </div>`;

  const text = filled.map(([k, v]) => `${k} : ${v}`).join("\n");

  await resend.emails.send({
    from: NOTIFY_FROM,
    to: NOTIFY_TO,
    replyTo: lead.email,
    subject: `Nouvelle inscription — ${fullName}`,
    html,
    text,
  });
}
