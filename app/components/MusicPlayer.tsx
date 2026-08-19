"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../config/site";

/**
 * MusicPlayer — floating button musik dengan auto-play saat interaksi pertama.
 *
 * FIX: Hooks-before-return — musicFile check dipindah ke dalam useEffect,
 *      menghindari Rules of Hooks violation (early return sebelum hooks lain).
 */

type PlayerState = "idle" | "playing" | "paused" | "error";

export function MusicPlayer() {
  const audioRef            = useRef<HTMLAudioElement | null>(null);
  const [state, setState]   = useState<PlayerState>("idle");
  const [muted, setMuted]   = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showHint, setShowHint]   = useState(false);
  const [hasMusic, setHasMusic]   = useState(false);
  const startedRef = useRef(false);
  const musicFile  = siteConfig.musicFile;

  // ── Setup audio (hanya jika musicFile ada) ──────────────────────────────
  useEffect(() => {
    if (!musicFile) return;
    setHasMusic(true);

    const startTime = siteConfig.musicStartTime ?? 0;
    let hasSeeked = false;

    const audio = new Audio(musicFile);
    audio.loop    = false; // Handled via 'ended' event to loop back to startTime
    audio.volume  = volume;
    audio.preload = "metadata";
    audioRef.current = audio;

    const onPlaying = () => setState("playing");
    const onPause   = () => setState("paused");
    const onError   = () => setState("error");

    // Seek ke posisi startTime sekali saat metadata siap
    const applyStartTime = () => {
      if (startTime > 0 && !hasSeeked && audio.duration && startTime < audio.duration) {
        audio.currentTime = startTime;
        hasSeeked = true;
      }
    };

    // Saat audio selesai (loop), kembali ke startTime bukan ke 0
    const onEnded = () => {
      if (startTime > 0 && audio.duration && startTime < audio.duration) {
        audio.currentTime = startTime;
      } else {
        audio.currentTime = 0;
      }
      audio.play().catch(() => {});
    };

    audio.addEventListener("playing",        onPlaying);
    audio.addEventListener("pause",          onPause);
    audio.addEventListener("error",          onError);
    audio.addEventListener("loadedmetadata", applyStartTime);
    audio.addEventListener("canplay",        applyStartTime);
    audio.addEventListener("ended",          onEnded);

    // Hint tooltip muncul setelah 2 detik jika belum ada interaksi
    const hintTimer = setTimeout(() => setShowHint(true), 2000);

    // Auto-play saat interaksi pertama user (bypass browser autoplay policy)
    const handleFirstInteraction = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      setShowHint(false);
      
      applyStartTime();
      audio.play().catch(() => setState("error"));
      window.removeEventListener("click",      handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown",    handleFirstInteraction);
    };

    window.addEventListener("click",      handleFirstInteraction, { passive: true });
    window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    window.addEventListener("keydown",    handleFirstInteraction, { passive: true });

    return () => {
      clearTimeout(hintTimer);
      audio.pause();
      audio.removeEventListener("playing",        onPlaying);
      audio.removeEventListener("pause",          onPause);
      audio.removeEventListener("error",          onError);
      audio.removeEventListener("loadedmetadata", applyStartTime);
      audio.removeEventListener("canplay",        applyStartTime);
      audio.removeEventListener("ended",          onEnded);
      audio.src = "";
      window.removeEventListener("click",      handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown",    handleFirstInteraction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicFile]);


  // ── Sync volume ke audio element setiap kali volume state berubah ──────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setShowHint(false);
    if (state === "playing") {
      audio.pause();
    } else {
      startedRef.current = true;
      audio.play().catch(() => setState("error"));
    }
  }, [state]);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  }, []);

  // Tidak render apapun jika: musicFile kosong, atau audio error
  if (!hasMusic || state === "error") return null;

  return (
    <div
      className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2"
      role="region"
      aria-label="Pemutar musik"
    >
      {/* Tooltip hint */}
      <AnimatePresence>
        {showHint && state === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="clay-card px-3 py-2 text-xs font-body text-[#9D4E6B] whitespace-nowrap pointer-events-none"
          >
            🎵 Tap untuk putar musik!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volume panel — muncul saat musik playing */}
      <AnimatePresence>
        {state === "playing" && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="clay-card px-3 py-3 flex flex-col items-center gap-2 overflow-hidden"
          >
            <button
              onClick={toggleMute}
              className="text-[#9D4E6B] hover:text-[#FB7185] transition-colors duration-150 cursor-pointer p-1 rounded-full focus-visible:ring-2 focus-visible:ring-pink-300"
              aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
            >
              {muted ? <MuteIcon /> : <VolumeIcon />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="w-16 accent-[#FB7185] cursor-pointer"
              aria-label="Volume musik"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((muted ? 0 : volume) * 100)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main play/pause button */}
      <motion.button
        onClick={togglePlay}
        className="clay-btn w-14 h-14 bg-gradient-to-br from-[#FB7185] to-[#F472B6] flex items-center justify-center relative overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        aria-label={state === "playing" ? "Pause musik" : "Play musik"}
      >
        {/* Ripple saat playing */}
        {state === "playing" && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-white/40 pointer-events-none"
              animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-white/25 pointer-events-none"
              animate={{ scale: [1, 2.0], opacity: [0.4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
          </>
        )}

        {/* Icon */}
        <AnimatePresence mode="wait">
          <motion.span
            key={state}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 30 }}
            transition={{ duration: 0.18 }}
            className="text-white relative z-10 flex items-center justify-center"
          >
            {state === "playing" ? <PauseIcon /> : <PlayIcon />}
          </motion.span>
        </AnimatePresence>

        {/* Floating musical notes */}
        {state === "playing" && !muted && <FloatingNotes />}
      </motion.button>
    </div>
  );
}

// ── Icons (SVG, bukan emoji — sesuai ui-ux-pro-max rules) ─────────────────
function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}
function VolumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

// ── Floating musical notes ─────────────────────────────────────────────────
function FloatingNotes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full" aria-hidden="true">
      {(["♪", "♫", "♩"] as const).map((note, i) => (
        <motion.span
          key={i}
          className="absolute text-white/70 text-xs font-bold select-none"
          style={{ bottom: "50%", left: "50%" }}
          animate={{
            y: [-10, -50],
            x: [-8 + i * 8, -14 + i * 14],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.1, 0.7],
          }}
          transition={{
            duration: 1.8,
            delay: i * 0.55,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          {note}
        </motion.span>
      ))}
    </div>
  );
}
