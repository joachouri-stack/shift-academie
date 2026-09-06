"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  formations,
  modules,
  leads,
  inscriptions,
  users,
  questionsTutorat,
  sessionsDirect,
  sessionsDirectParticipants,
} from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";

function s(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}

/* --- Formations --- */
export async function createFormation(fd: FormData) {
  await requireAdmin();
  const title = s(fd, "title");
  if (!title) return;
  db.insert(formations)
    .values({
      id: randomUUID(),
      title,
      description: "",
      format: "distanciel",
      published: false,
      position: 0,
      createdAt: new Date(),
    })
    .run();
  revalidatePath("/admin");
}

export async function updateFormation(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  if (!id) return;
  db.update(formations)
    .set({
      title: s(fd, "title"),
      description: s(fd, "description"),
      format: s(fd, "format") || "distanciel",
      published: fd.get("published") === "on",
    })
    .where(eq(formations.id, id))
    .run();
  revalidatePath(`/admin/formations/${id}`);
  revalidatePath("/admin");
}

export async function deleteFormation(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  if (!id) return;
  db.delete(modules).where(eq(modules.formationId, id)).run();
  db.delete(formations).where(eq(formations.id, id)).run();
  revalidatePath("/admin");
  redirect("/admin");
}

/* --- Modules --- */
export async function addModule(fd: FormData) {
  await requireAdmin();
  const formationId = s(fd, "formationId");
  const title = s(fd, "title");
  if (!formationId || !title) return;
  const row = db
    .select({ c: sql<number>`count(*)` })
    .from(modules)
    .where(eq(modules.formationId, formationId))
    .get();
  db.insert(modules)
    .values({
      id: randomUUID(),
      formationId,
      title,
      position: row?.c ?? 0,
      createdAt: new Date(),
    })
    .run();
  revalidatePath(`/admin/formations/${formationId}`);
}

export async function deleteModule(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const formationId = s(fd, "formationId");
  if (!id) return;
  db.delete(modules).where(eq(modules.id, id)).run();
  revalidatePath(`/admin/formations/${formationId}`);
}

/* Vidéo + durée RÉELLE d'un module (référence pour la validation d'assiduité). */
export async function updateModuleMedia(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const formationId = s(fd, "formationId");
  if (!id) return;
  const dureeSecondes = Math.max(0, parseInt(s(fd, "dureeSecondes") || "0", 10) || 0);
  db.update(modules)
    .set({ videoRef: s(fd, "videoRef"), dureeSecondes })
    .where(eq(modules.id, id))
    .run();
  revalidatePath(`/admin/formations/${formationId}`);
}

/* --- Inscriptions (parcours apprenant) --- */
export async function enrollLearner(fd: FormData) {
  await requireAdmin();
  const formationId = s(fd, "formationId");
  const email = s(fd, "email").toLowerCase();
  if (!formationId || !email) return;

  const user = db.select().from(users).where(eq(users.email, email)).get();
  if (!user) return; // apprenant introuvable (il doit avoir créé son compte)

  const existing = db
    .select()
    .from(inscriptions)
    .where(
      and(
        eq(inscriptions.apprenantId, user.id),
        eq(inscriptions.formationId, formationId)
      )
    )
    .get();
  if (existing) return; // déjà inscrit

  db.insert(inscriptions)
    .values({
      id: randomUUID(),
      apprenantId: user.id,
      formationId,
      dateDebut: new Date(),
      dateFin: null,
      statut: "en_cours",
      financeur: "",
      prixCents: 0,
      createdAt: new Date(),
    })
    .run();
  revalidatePath(`/admin/formations/${formationId}`);
}

/* --- Tutorat (accompagnement asynchrone) --- */
export async function answerQuestion(fd: FormData) {
  const admin = await requireAdmin();
  const id = s(fd, "id");
  const reponse = s(fd, "reponse");
  if (!id || !reponse) return;
  db.update(questionsTutorat)
    .set({ reponse, dateReponse: new Date(), formateurId: admin.id })
    .where(eq(questionsTutorat.id, id))
    .run();
  revalidatePath("/admin/tutorat");
}

/* --- Sessions live (accompagnement synchrone) --- */
export async function createSessionDirect(fd: FormData) {
  const admin = await requireAdmin();
  const dateStr = s(fd, "date");
  if (!dateStr) return;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return;
  const dureeMinutes = Math.max(0, parseInt(s(fd, "dureeMinutes") || "0", 10) || 0);
  db.insert(sessionsDirect)
    .values({
      id: randomUUID(),
      date,
      dureeMinutes,
      sujet: s(fd, "sujet"),
      formateurId: admin.id,
      createdAt: new Date(),
    })
    .run();
  revalidatePath("/admin/sessions");
}

export async function toggleParticipant(fd: FormData) {
  await requireAdmin();
  const sessionDirectId = s(fd, "sessionDirectId");
  const apprenantId = s(fd, "apprenantId");
  if (!sessionDirectId || !apprenantId) return;
  const existing = db
    .select()
    .from(sessionsDirectParticipants)
    .where(
      and(
        eq(sessionsDirectParticipants.sessionDirectId, sessionDirectId),
        eq(sessionsDirectParticipants.apprenantId, apprenantId)
      )
    )
    .get();
  if (existing) {
    db.delete(sessionsDirectParticipants)
      .where(eq(sessionsDirectParticipants.id, existing.id))
      .run();
  } else {
    db.insert(sessionsDirectParticipants)
      .values({
        id: randomUUID(),
        sessionDirectId,
        apprenantId,
        createdAt: new Date(),
      })
      .run();
  }
  revalidatePath("/admin/sessions");
}

export async function deleteSessionDirect(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  if (!id) return;
  db.delete(sessionsDirectParticipants)
    .where(eq(sessionsDirectParticipants.sessionDirectId, id))
    .run();
  db.delete(sessionsDirect).where(eq(sessionsDirect.id, id)).run();
  revalidatePath("/admin/sessions");
}

/* --- Demandes de réservation --- */
export async function toggleLead(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const handled = fd.get("handled") === "true";
  db.update(leads).set({ handled: !handled }).where(eq(leads.id, id)).run();
  revalidatePath("/admin");
}
