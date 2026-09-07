"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./VideoUpload.module.css";

const ALLOWED_EXT = ["mp4", "webm", "mov", "m4v", "ogv"];

function extOf(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

/** Lit la durée réelle de la vidéo côté navigateur (métadonnées). */
function readDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(v.duration) ? Math.round(v.duration) : 0);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    v.src = url;
  });
}

export default function VideoUpload({
  moduleId,
  formationId,
}: {
  moduleId: string;
  formationId: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleFile(file: File) {
    setError("");
    setDone(false);
    const ext = extOf(file.name);
    if (!ALLOWED_EXT.includes(ext)) {
      setError("Format non supporté (mp4, webm, mov, m4v, ogv).");
      return;
    }

    setBusy(true);
    setProgress(0);
    const duree = await readDuration(file);

    const qs = new URLSearchParams({
      moduleId,
      formationId,
      ext,
      dureeSecondes: String(duree),
    });

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/media/upload?${qs.toString()}`);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else {
            let msg = "Échec de l'envoi.";
            try {
              msg = JSON.parse(xhr.responseText).error || msg;
            } catch {}
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error("Erreur réseau pendant l'envoi."));
        xhr.send(file);
      });
      setDone(true);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.uploader}>
      <label className={styles.label}>
        {busy ? "Envoi en cours…" : "Téléverser une vidéo depuis mon ordinateur"}
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v,.ogv"
          disabled={busy}
          className={styles.input}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </label>

      {busy && (
        <div className={styles.barWrap} aria-hidden>
          <div className={styles.bar} style={{ width: `${progress}%` }} />
          <span className={styles.pct}>{progress}%</span>
        </div>
      )}
      {done && !busy && (
        <p className={styles.ok}>
          ✓ Vidéo enregistrée. La durée réelle a été détectée automatiquement.
        </p>
      )}
      {error && <p className={styles.err}>{error}</p>}
    </div>
  );
}
