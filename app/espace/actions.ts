"use server";

import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { inscriptions, questionsTutorat } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";

function s(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}

/* Un apprenant pose une question de tutorat (liée ou non à un module). */
export async function askQuestion(fd: FormData) {
  const user = await requireUser();
  const inscriptionId = s(fd, "inscriptionId");
  const moduleId = s(fd, "moduleId") || null;
  const question = s(fd, "question");
  if (!inscriptionId || !question) return;

  const ins = db
    .select()
    .from(inscriptions)
    .where(
      and(
        eq(inscriptions.id, inscriptionId),
        eq(inscriptions.apprenantId, user.id)
      )
    )
    .get();
  if (!ins) return; // pas propriétaire de l'inscription

  db.insert(questionsTutorat)
    .values({
      id: randomUUID(),
      inscriptionId,
      apprenantId: user.id,
      moduleId,
      question,
      reponse: null,
      formateurId: null,
      dateQuestion: new Date(),
      dateReponse: null,
      createdAt: new Date(),
    })
    .run();

  if (moduleId) revalidatePath(`/espace/modules/${moduleId}`);
  revalidatePath("/admin/tutorat");
}
