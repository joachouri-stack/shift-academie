"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { formations, modules, leads } from "@/lib/db/schema";
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

/* --- Demandes de réservation --- */
export async function toggleLead(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const handled = fd.get("handled") === "true";
  db.update(leads).set({ handled: !handled }).where(eq(leads.id, id)).run();
  revalidatePath("/admin");
}
