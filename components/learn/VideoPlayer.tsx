"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./VideoPlayer.module.css";

const HEARTBEAT_MS = 15000;
const SEEK_TOLERANCE_S = 1.5;

type Props = {
  inscriptionId: string;
  moduleId: string;
  videoUrl: string;
  dureeSecondes: number;
  initialMaxPositionS: number;
  initialPourcentage: number;
  initialValide: boolean;
};

export default function VideoPlayer({
  inscriptionId,
  moduleId,
  videoUrl,
  dureeSecondes,
  initialMaxPositionS,
  initialPourcentage,
  initialValide,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const maxWatchedRef = useRef(initialMaxPositionS);
  const sessionStartRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [pourcentage, setPourcentage] = useState(initialPourcentage);
  const [valide, setValide] = useState(initialValide);
  const [blocked, setBlocked] = useState(false);

  async function sendHeartbeat() {
    const video = videoRef.current;
    if (!video) return;
    try {
      const res = await fetch("/api/visionnage/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inscriptionId,
          moduleId,
          positionS: Math.floor(video.currentTime),
        }),
        keepalive: true,
      });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.pourcentage === "number") setPourcentage(data.pourcentage);
      if (typeof data.valide === "boolean") setValide(data.valide);
      // Le serveur fait autorité sur la position max autorisée.
      if (typeof data.maxPositionS === "number") {
        maxWatchedRef.current = Math.max(maxWatchedRef.current, data.maxPositionS);
      }
    } catch {
      /* réseau : on réessaiera au prochain battement */
    }
  }

  function finalizeSession() {
    if (!sessionStartRef.current) return;
    const payload = JSON.stringify({
      inscriptionId,
      moduleId,
      startedAt: sessionStartRef.current,
    });
    sessionStartRef.current = null;
    try {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/visionnage/session", blob);
    } catch {
      fetch("/api/visionnage/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }

  function startTimer() {
    if (timerRef.current) return;
    if (!sessionStartRef.current) sessionStartRef.current = new Date().toISOString();
    sendHeartbeat(); // battement immédiat (fixe la base de temps côté serveur)
    timerRef.current = setInterval(sendHeartbeat, HEARTBEAT_MS);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reprise là où l'apprenant s'était arrêté.
    const onLoaded = () => {
      const resume = Math.min(maxWatchedRef.current, video.duration || 0);
      if (resume > 1) video.currentTime = resume;
    };

    const onPlay = () => startTimer();

    const onPauseOrEnd = () => {
      stopTimer();
      sendHeartbeat();
      finalizeSession();
    };

    // Anti-avance rapide : on bloque tout déplacement au-delà du réellement vu.
    const onSeeking = () => {
      const maxAllowed = maxWatchedRef.current + SEEK_TOLERANCE_S;
      if (video.currentTime > maxAllowed) {
        video.currentTime = maxWatchedRef.current;
        setBlocked(true);
        setTimeout(() => setBlocked(false), 1800);
      }
    };

    // La progression réelle fait avancer la position max autorisée.
    const onTimeUpdate = () => {
      if (!video.seeking && video.currentTime > maxWatchedRef.current) {
        maxWatchedRef.current = video.currentTime;
      }
    };

    const onPageHide = () => {
      stopTimer();
      finalizeSession();
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPauseOrEnd);
    video.addEventListener("ended", onPauseOrEnd);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("timeupdate", onTimeUpdate);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      stopTimer();
      finalizeSession();
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPauseOrEnd);
      video.removeEventListener("ended", onPauseOrEnd);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("timeupdate", onTimeUpdate);
      window.removeEventListener("pagehide", onPageHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.player}>
      <video
        ref={videoRef}
        className={styles.video}
        src={videoUrl}
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        playsInline
        preload="metadata"
      />

      <div className={styles.bar} aria-hidden="true">
        <div className={styles.barFill} style={{ width: `${pourcentage}%` }} />
      </div>

      <div className={styles.status}>
        <span className={styles.pct}>{pourcentage}% suivi</span>
        {valide ? (
          <span className={`${styles.badge} ${styles.badgeOk}`}>✓ Module validé</span>
        ) : (
          <span className={styles.badge}>
            À valider — visionnez au moins 90 %
          </span>
        )}
      </div>

      {blocked && (
        <p className={styles.blockedMsg} role="status">
          L&rsquo;avance rapide est désactivée : vous ne pouvez pas dépasser la
          partie déjà visionnée.
        </p>
      )}

      {dureeSecondes === 0 && (
        <p className={styles.warn}>
          ⚠️ Durée du module non renseignée par l&rsquo;administrateur — la
          validation d&rsquo;assiduité ne pourra pas se calculer.
        </p>
      )}
    </div>
  );
}
