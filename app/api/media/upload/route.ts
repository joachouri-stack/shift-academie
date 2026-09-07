import { NextRequest, NextResponse } from "next/server";
import { createWriteStream } from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { modules } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { MEDIA_DIR } from "@/lib/media";

export const runtime = "nodejs";
// Uploads peuvent être volumineux : pas de mise en cache, pas de body parsing.
export const dynamic = "force-dynamic";

const ALLOWED_EXT = new Set(["mp4", "webm", "mov", "m4v", "ogv"]);

/**
 * Upload d'une vidéo (auto-hébergée sur le VPS, volume persistant).
 * Le corps de la requête est le fichier brut ; on le streame directement sur
 * le disque (empreinte mémoire quasi nulle, même pour des fichiers lourds).
 * Query : ?moduleId=…&formationId=…&dureeSecondes=…&ext=mp4
 */
export async function POST(req: NextRequest) {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId") ?? "";
  const dureeSecondes = Math.max(
    0,
    parseInt(searchParams.get("dureeSecondes") ?? "0", 10) || 0
  );
  const ext = (searchParams.get("ext") ?? "").toLowerCase();

  if (!moduleId) {
    return NextResponse.json({ error: "moduleId manquant" }, { status: 400 });
  }
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "Format non supporté (mp4, webm, mov, m4v, ogv)" },
      { status: 415 }
    );
  }
  if (!req.body) {
    return NextResponse.json({ error: "Corps vide" }, { status: 400 });
  }

  const mod = db.select().from(modules).where(eq(modules.id, moduleId)).get();
  if (!mod) {
    return NextResponse.json({ error: "Module introuvable" }, { status: 404 });
  }

  const stored = `${randomUUID()}.${ext}`;
  const dest = join(MEDIA_DIR, stored);

  try {
    // Web ReadableStream → Node stream → fichier.
    await pipeline(
      Readable.fromWeb(req.body as Parameters<typeof Readable.fromWeb>[0]),
      createWriteStream(dest)
    );
  } catch (err) {
    await unlink(dest).catch(() => {});
    return NextResponse.json(
      { error: "Échec de l'écriture du fichier" },
      { status: 500 }
    );
  }

  const videoRef = `/api/media/${stored}`;
  const patch: { videoRef: string; dureeSecondes?: number } = { videoRef };
  if (dureeSecondes > 0) patch.dureeSecondes = dureeSecondes;
  db.update(modules).set(patch).where(eq(modules.id, moduleId)).run();

  return NextResponse.json({ ok: true, videoRef, dureeSecondes });
}
