"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Cute Web Audio API pop sound
function playPopSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(850, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Ignore audio policy errors
  }
}

// Coordinate-targeted confetti burst for each balloon
async function popConfetti(x: number, y: number, color: string) {
  try {
    const confetti = (await import("canvas-confetti")).default;
    const originX = Math.max(0.05, Math.min(0.95, x / window.innerWidth));
    const originY = Math.max(0.05, Math.min(0.95, y / window.innerHeight));

    confetti({
      particleCount: 38,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: [color, "#FFFFFF", "#FDE68A", "#F472B6", "#C084FC", "#67E8F9"],
      shapes: ["circle", "star"],
      scalar: 1.1,
      startVelocity: 26,
      ticks: 75,
      gravity: 0.85,
    });
  } catch {
    // Fallback if canvas-confetti fails
  }
}

// Grand confetti celebration when all balloons are popped
async function fireGrandCelebration() {
  try {
    const confetti = (await import("canvas-confetti")).default;
    const colors = ["#FB7185", "#F472B6", "#C084FC", "#60A5FA", "#34D399", "#FBBF24", "#F43F5E"];

    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.5 },
      colors,
      scalar: 1.25,
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.65 },
        colors,
      });
    }, 220);
  } catch {}
}

const BALLOONS = [
  { id: 0, color: "#FB7185", size: 62, delay: 0,    label: "💖", duration: 2.4 },
  { id: 1, color: "#C084FC", size: 70, delay: 0.15, label: "✨", duration: 2.8 },
  { id: 2, color: "#60A5FA", size: 56, delay: 0.3,  label: "🌸", duration: 2.5 },
  { id: 3, color: "#34D399", size: 52, delay: 0.45, label: "🎀", duration: 2.2 },
  { id: 4, color: "#FBBF24", size: 66, delay: 0.6,  label: "⭐", duration: 2.9 },
  { id: 5, color: "#F472B6", size: 60, delay: 0.2,  label: "🥳", duration: 2.3 },
  { id: 6, color: "#A78BFA", size: 64, delay: 0.35, label: "🍰", duration: 2.6 },
  { id: 7, color: "#38BDF8", size: 54, delay: 0.5,  label: "🎉", duration: 2.3 },
  { id: 8, color: "#F43F5E", size: 68, delay: 0.25, label: "💐", duration: 2.7 },
  { id: 9, color: "#FB923C", size: 58, delay: 0.4,  label: "🍭", duration: 2.5 },
];

const AMBIENT_BALLOONS = [
  { top: "6%",  left: "4%",  color: "#FBCFE8", size: 48, duration: 4.8, delay: 0 },
  { top: "12%", right: "6%", color: "#DDD6FE", size: 56, duration: 5.4, delay: 0.8 },
  { top: "42%", left: "3%",  color: "#BAE6FD", size: 42, duration: 5.0, delay: 0.4 },
  { top: "48%", right: "4%", color: "#FED7AA", size: 50, duration: 5.6, delay: 1.2 },
  { top: "82%", left: "6%",  color: "#A7F3D0", size: 44, duration: 4.6, delay: 0.6 },
  { top: "78%", right: "5%", color: "#FBCFE8", size: 52, duration: 5.2, delay: 1.0 },
];

export function Interactive3DSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible,  setVisible]  = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [rotX, setRotX] = useState(-15);
  const [rotY, setRotY] = useState(20);
  const dragging    = useRef(false);
  const dragStart   = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const isDragMove  = useRef(false);

  const [poppedBalloons, setPoppedBalloons] = useState<Set<number>>(new Set());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Drag rotation handlers (pointer events) ──────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (revealed) return;
    dragging.current  = true;
    isDragMove.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY, rx: rotX, ry: rotY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [revealed, rotX, rotY]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) isDragMove.current = true;
    setRotY(prev => Math.max(-60, Math.min(60,  dragStart.current.ry + dx * 0.45)));
    setRotX(prev => Math.max(-60, Math.min(20,  dragStart.current.rx - dy * 0.45)));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Click = open only if not a drag
  const handleClick = useCallback(() => {
    if (isDragMove.current || revealed) return;
    setRevealed(true);
  }, [revealed]);

  const popBalloon = useCallback((id: number, e: React.MouseEvent<HTMLButtonElement>, color: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    playPopSound();
    popConfetti(clickX, clickY, color);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate?.([30, 40]);
    }

    setPoppedBalloons(prev => {
      const next = new Set([...prev, id]);
      if (next.size === BALLOONS.length) {
        setTimeout(fireGrandCelebration, 300);
      }
      return next;
    });
  }, []);

  const resetBalloons = useCallback(() => {
    setPoppedBalloons(new Set());
  }, []);

  return (
    <section
      ref={ref}
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FDF2F8 0%, #EDE9FE 100%)" }}
      aria-label="Elemen 3D interaktif"
    >
      {/* Ambient Floating Background Balloons (Menutupi Seluruh Layar) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {AMBIENT_BALLOONS.map((b, idx) => (
          <motion.div
            key={idx}
            className="absolute opacity-35"
            style={{ top: b.top, left: b.left, right: b.right, width: b.size }}
            animate={{
              y: [-25, 25, -25],
              x: [-12, 12, -12],
              rotate: [-8, 8, -8],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 60 90" width={b.size} height={b.size * 1.4}>
              <ellipse cx="30" cy="30" rx="27" ry="30" fill={b.color} />
              <ellipse cx="19" cy="17" rx="10" ry="8" fill="white" opacity="0.4" />
              <ellipse cx="30" cy="61" rx="4" ry="3" fill={b.color} />
              <path d="M30 64 Q24 75 30 84" stroke={b.color} strokeWidth="2" fill="none" opacity="0.6" />
            </svg>
          </motion.div>
        ))}

        {/* Floating Sparkles across the screen */}
        {[
          { top: "18%", left: "15%", delay: 0 },
          { top: "25%", right: "20%", delay: 0.7 },
          { top: "65%", left: "12%", delay: 1.2 },
          { top: "72%", right: "15%", delay: 0.4 },
        ].map((s, idx) => (
          <motion.span
            key={`sparkle-${idx}`}
            className="absolute text-pink-300/60 select-none text-xl"
            style={{ top: s.top, left: s.left, right: s.right }}
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.8, 0.3], rotate: [0, 90, 180] }}
            transition={{ duration: 3, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            ✦
          </motion.span>
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-8 space-y-2 relative z-10"
      >
        <p className="text-[#9D4E6B]/60 text-xs font-body font-semibold tracking-widest uppercase">
          Untuk Kamu
        </p>
        <h2 className="font-script text-4xl sm:text-5xl">
          <span className="text-gradient">Hadiahnya di sini!</span>{" "}
          <span className="inline-block" aria-hidden="true">🎁</span>
        </h2>
        <p className="text-[#9D4E6B]/70 font-body text-sm">
          {revealed
            ? "Semoga kamu suka! 🥰"
            : "Putar kado-nya, lalu klik untuk buka kejutan!"}
        </p>
      </motion.div>

      {/* 3D Gift Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={visible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 150 }}
        className="relative flex flex-col items-center z-10"
        style={{ perspective: "800px" }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: dragging.current ? "none" : "transform 0.4s ease-out",
            touchAction: "none",
            cursor: revealed ? "default" : "grab",
          }}
          className="select-none active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label={revealed ? "Kado sudah dibuka" : "Putar lalu klik untuk membuka kado"}
          onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !revealed) setRevealed(true); }}
        >
          <GiftBox3D revealed={revealed} />
        </div>

        {/* Reveal card */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 18 }}
              className="clay-card mt-8 p-6 text-center max-w-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                className="text-4xl mb-3"
                aria-hidden="true"
              >
                🎉
              </motion.div>
              <h3 className="font-script text-3xl text-gradient mb-2">Kejutan!</h3>
              <p className="font-body text-[#4A1D2E] text-sm sm:text-base leading-relaxed">
                Hadiahku yang sesungguhnya adalah semua momen bersamamu.
                Setiap tawa, setiap cerita — itu yang paling berharga. 💕
              </p>
              <p className="font-body text-[#FB7185] text-sm font-semibold mt-3">
                Hadiahnya menyusul yaaa! 🎁✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Balloons Festive Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className="mt-12 w-full max-w-2xl flex flex-col items-center gap-4 relative z-10"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl animate-bounce">🎈</span>
          <p className="text-[#9D4E6B] text-sm sm:text-base font-body font-bold tracking-wide">
            Pop the balloons!
          </p>
          <span className="text-xs font-body font-semibold px-2 py-0.5 bg-pink-100 text-[#FB7185] rounded-full">
            {poppedBalloons.size} / {BALLOONS.length}
          </span>
        </div>

        {/* Interactive Balloon Canvas - Distributed festive layout */}
        <div className="w-full flex gap-3 sm:gap-6 items-end flex-wrap justify-center min-h-[140px] px-2 py-4">
          {BALLOONS.map(b => (
            <BalloonItem
              key={b.id}
              {...b}
              popped={poppedBalloons.has(b.id)}
              onPop={(e) => popBalloon(b.id, e, b.color)}
              visible={visible}
            />
          ))}
        </div>

        {/* All Balloons Popped Banner & Replay */}
        <AnimatePresence>
          {poppedBalloons.size === BALLOONS.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 220 }}
              className="clay-card px-6 py-4 flex flex-col items-center gap-3 text-center mt-2 border border-pink-200"
            >
              <p className="font-script text-2xl sm:text-3xl">
                <span>🎊</span>{" "}
                <span className="text-gradient">Horeee semua balon meletus!</span>{" "}
                <span>🥳✨</span>
              </p>
              <button
                onClick={resetBalloons}
                className="clay-btn px-4 py-2 bg-gradient-to-r from-[#FB7185] to-[#F472B6] text-white text-xs sm:text-sm font-body font-bold rounded-full cursor-pointer hover:shadow-lg transition-transform active:scale-95"
              >
                🎈 Tiup Balon Lagi!
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

// ── Gift Box 3D (pure CSS 3D) ─────────────────────────────────────────────
function GiftBox3D({ revealed }: { revealed: boolean }) {
  const S = 140;       // box size
  const LID_H = 30;    // lid height
  const HALF = S / 2;

  const faces = [
    { tf: `translateZ(${HALF}px)`,              bg: "#FBCFE8" },
    { tf: `translateZ(-${HALF}px) rotateY(180deg)`, bg: "#FBCFE8" },
    { tf: `translateX(-${HALF}px) rotateY(-90deg)`, bg: "#FDE8EF" },
    { tf: `translateX(${HALF}px) rotateY(90deg)`,   bg: "#FDE8EF" },
    { tf: `translateY(${HALF}px) rotateX(-90deg)`,  bg: "#FBCFE8" },
  ];

  return (
    <div style={{ width: S, height: S + LID_H, transformStyle: "preserve-3d", position: "relative" }}>
      {/* Lid */}
      <motion.div
        style={{
          position: "absolute", top: 0, left: -8,
          width: S + 16, height: LID_H + 10,
          background: "linear-gradient(135deg, #FB7185, #F472B6)",
          border: "3px solid #E11D48",
          borderRadius: 12,
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          zIndex: 10,
          boxShadow: "0 4px 16px rgba(251,113,133,0.4)",
        }}
        animate={revealed
          ? { rotateX: -120, y: -20 }
          : { rotateX: 0,    y: 0   }}
        transition={{ duration: 0.9, type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Ribbon on lid */}
        <div style={{ position: "absolute", left: "50%", top: 0, width: 14, height: "100%",
          background: "rgba(225,29,72,0.4)", transform: "translateX(-50%)" }} />
        {/* Bow */}
        <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)" }}>
          <svg viewBox="0 0 60 28" width="60" height="28" aria-hidden="true">
            <ellipse cx="15" cy="14" rx="14" ry="10" fill="#FEF9F0" transform="rotate(-20 15 14)" />
            <ellipse cx="45" cy="14" rx="14" ry="10" fill="#FEF9F0" transform="rotate(20 45 14)" />
            <circle cx="30" cy="14" r="7" fill="#E11D48" />
            <circle cx="30" cy="14" r="4" fill="#FEF9F0" />
          </svg>
        </div>
      </motion.div>

      {/* Box faces */}
      <div style={{ position: "absolute", top: LID_H, width: S, height: S, transformStyle: "preserve-3d" }}>
        {faces.map((face, i) => (
          <div
            key={i}
            style={{
              position: "absolute", width: S, height: S,
              transform: face.tf,
              background: face.bg,
              border: "3px solid #F9A8D4",
              borderRadius: 10,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: "50%", top: 0, width: 12, height: "100%",
              background: "#FB7185", transform: "translateX(-50%)", opacity: 0.45 }} />
            <div style={{ position: "absolute", top: "38%", left: 0, width: "100%", height: 12,
              background: "#FB7185", opacity: 0.45 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Enhanced Interactive Balloon Item ───────────────────────────────────────
interface BalloonProps {
  id: number;
  color: string;
  size: number;
  delay: number;
  label?: string;
  duration: number;
  popped: boolean;
  onPop: (e: React.MouseEvent<HTMLButtonElement>) => void;
  visible: boolean;
}

function BalloonItem({ color, size, delay, duration, popped, onPop, visible }: BalloonProps) {
  return (
    <AnimatePresence>
      {!popped && (
        <motion.button
          initial={{ opacity: 0, y: 60, scale: 0 }}
          animate={visible ? {
            opacity: 1,
            scale: 1,
            y: [0, -18, 0],
            x: [0, 4, -4, 0],
            rotate: [0, 4, -4, 0],
            transition: {
              opacity: { delay, duration: 0.4 },
              scale:   { delay, duration: 0.5, type: "spring", stiffness: 220 },
              y:       { delay: delay + 0.5, duration: duration, repeat: Infinity, ease: "easeInOut" },
              x:       { delay: delay + 0.7, duration: duration * 1.3, repeat: Infinity, ease: "easeInOut" },
              rotate:  { delay: delay + 0.3, duration: duration * 1.5, repeat: Infinity, ease: "easeInOut" },
            },
          } : {}}
          exit={{
            scale: [1, 1.6, 0],
            opacity: [1, 0.9, 0],
            rotate: [0, 15, 30],
            transition: { duration: 0.28, ease: "easeOut" },
          }}
          onClick={onPop}
          className="relative flex flex-col items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 rounded-full group select-none"
          aria-label="Pop balon"
          style={{ width: size, flexShrink: 0 }}
          whileHover={{ scale: 1.18, y: -6 }}
          whileTap={{ scale: 0.85 }}
        >
          {/* Hover highlight badge */}
          <span className="absolute -top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[10px] font-bold text-[#FB7185] bg-white/90 px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap pointer-events-none">
            Pop! 💥
          </span>

          <svg
            viewBox="0 0 60 90"
            width={size}
            height={size * 1.4}
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            <defs>
              <radialGradient id={`gloss-${color.replace('#','')}`} cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="white" stopOpacity="0.45" />
                <stop offset="60%" stopColor={color} />
                <stop offset="100%" stopColor={color} stopOpacity="0.85" />
              </radialGradient>
            </defs>
            {/* Balloon body with radial 3D lighting */}
            <ellipse cx="30" cy="30" rx="27" ry="30" fill={`url(#gloss-${color.replace('#','')})`} />
            {/* Gloss highlight curve */}
            <path d="M16 14 Q22 10 32 14" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.65" fill="none" />
            <ellipse cx="18" cy="18" rx="5" ry="4" fill="white" opacity="0.5" />
            {/* Knot */}
            <ellipse cx="30" cy="61" rx="4.5" ry="3.5" fill={color} />
            {/* String wavy */}
            <path d="M30 64 Q22 74 32 82 T28 92" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.75" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
