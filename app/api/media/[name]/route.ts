import { NextRequest } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { join } from "path";
import { Readable } from "stream";
import { getCurrentUser } from "@/lib/auth";
import { MEDIA_DIR, contentType, isSafeName } from "@/lib/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sert une vidéo auto-hébergée avec support des requêtes « Range » (indispensable
 * pour la lecture et le déplacement dans la vidéo). Réservé aux utilisateurs
 * connectés (le lien direct ne fuite pas hors de l'espace apprenant/admin).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return new Response("Non autorisé", { status: 401 });

  const { name } = await params;
  if (!isSafeName(name)) return new Response("Introuvable", { status: 404 });

  const filePath = join(MEDIA_DIR, name);
  let size: number;
  try {
    const st = await stat(filePath);
    if (!st.isFile()) return new Response("Introuvable", { status: 404 });
    size = st.size;
  } catch {
    return new Response("Introuvable", { status: 404 });
  }

  const type = contentType(name);
  const range = req.headers.get("range");

  // Requête partielle (seek / lecture progressive).
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (m) {
      let start = m[1] ? parseInt(m[1], 10) : 0;
      let end = m[2] ? parseInt(m[2], 10) : size - 1;
      if (Number.isNaN(start)) start = 0;
      if (Number.isNaN(end)) end = size - 1;
      end = Math.min(end, size - 1);

      if (start > end || start >= size) {
        return new Response("Range non satisfiable", {
          status: 416,
          headers: { "Content-Range": `bytes */${size}` },
        });
      }

      const chunkSize = end - start + 1;
      const node = createReadStream(filePath, { start, end });
      return new Response(
        Readable.toWeb(node) as unknown as ReadableStream,
        {
          status: 206,
          headers: {
            "Content-Type": type,
            "Content-Length": String(chunkSize),
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Cache-Control": "private, max-age=0, no-store",
          },
        }
      );
    }
  }

  // Réponse complète.
  const node = createReadStream(filePath);
  return new Response(Readable.toWeb(node) as unknown as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": type,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=0, no-store",
    },
  });
}
