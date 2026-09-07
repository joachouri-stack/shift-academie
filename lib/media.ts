import "server-only";
import { mkdirSync } from "fs";
import { dirname, resolve } from "path";

/**
 * Dossier de stockage des vidéos (auto-hébergement sur le VPS).
 * Par défaut : à côté de la base, donc DANS le même volume persistant Coolify
 * (ex. DATABASE_PATH=/app/data/shift.db → médias dans /app/data/media).
 * Surchargeable via MEDIA_PATH.
 */
const dbPath = resolve(process.env.DATABASE_PATH || "./data/shift.db");
export const MEDIA_DIR = resolve(
  process.env.MEDIA_PATH || `${dirname(dbPath)}/media`
);
mkdirSync(MEDIA_DIR, { recursive: true });

const TYPES: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  m4v: "video/x-m4v",
  ogv: "video/ogg",
};

export function contentType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return TYPES[ext] ?? "application/octet-stream";
}

/** Vrai si `name` est un simple nom de fichier sûr (pas de traversée de chemin). */
export function isSafeName(name: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(name) && !name.includes("..");
}
