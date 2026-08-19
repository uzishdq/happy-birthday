"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { TimeLeft } from "./types";


interface LockScreenProps {
  timeLeft: TimeLeft;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="clay-card w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white/90 relative overflow-hidden">
        {/* Gloss effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-[17px]" />
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-2xl sm:text-3xl font-bold text-gradient font-body z-10"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs text-[#9D4E6B] font-semibold tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

// Sleeping chibi cat SVG
function SleepingChibi() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-36 sm:w-52 sm:h-44 animate-pulsate"
      aria-label="Kucing chibi yang tertidur"
      role="img"
    >
      {/* Body */}
      <ellipse cx="100" cy="140" rx="55" ry="35" fill="#FDE8EF" stroke="#F9A8D4" strokeWidth="2.5" />
      {/* Head */}
      <circle cx="100" cy="90" r="45" fill="#FDE8EF" stroke="#F9A8D4" strokeWidth="2.5" />
      {/* Left ear */}
      <ellipse cx="70" cy="52" rx="14" ry="18" fill="#FDE8EF" stroke="#F9A8D4" strokeWidth="2.5" />
      <ellipse cx="70" cy="54" rx="8" ry="11" fill="#FBCFE8" />
      {/* Right ear */}
      <ellipse cx="130" cy="52" rx="14" ry="18" fill="#FDE8EF" stroke="#F9A8D4" strokeWidth="2.5" />
      <ellipse cx="130" cy="54" rx="8" ry="11" fill="#FBCFE8" />
      {/* Closed eyes (sleeping) */}
      <path d="M82 88 Q88 83 94 88" stroke="#9D4E6B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M106 88 Q112 83 118 88" stroke="#9D4E6B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="78" cy="98" r="9" fill="#FBCFE8" opacity="0.6" />
      <circle cx="122" cy="98" r="9" fill="#FBCFE8" opacity="0.6" />
      {/* Nose + mouth */}
      <ellipse cx="100" cy="103" rx="4" ry="3" fill="#F9A8D4" />
      <path d="M97 106 Q100 110 103 106" stroke="#F9A8D4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Whiskers left */}
      <line x1="65" y1="103" x2="82" y2="105" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="65" y1="110" x2="82" y2="108" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Whiskers right */}
      <line x1="118" y1="105" x2="135" y2="103" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="118" y1="108" x2="135" y2="110" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Tail */}
      <path d="M155 150 Q175 130 160 115" stroke="#F9A8D4" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Z-Z-Z */}
      <text x="145" y="75" fill="#C084FC" fontSize="14" fontWeight="bold" opacity="0.7" fontFamily="sans-serif">z</text>
      <text x="158" y="60" fill="#C084FC" fontSize="18" fontWeight="bold" opacity="0.8" fontFamily="sans-serif">z</text>
      <text x="170" y="44" fill="#C084FC" fontSize="22" fontWeight="bold" fontFamily="sans-serif">Z</text>
    </svg>
  );
}

export function LockScreen({ timeLeft }: LockScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FDF2F8 0%, #FEF9F0 50%, #EDE9FE 100%)" }}
    >
      {/* Floating decorative elements */}
      <FloatingDecorations />

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="clay-card max-w-md w-full p-8 sm:p-10 flex flex-col items-center gap-6 relative z-10"
      >
        {/* Sealed gift icon */}
        <SealedGift />

        <div className="text-center space-y-2">
          <h1 className="font-script text-4xl sm:text-5xl leading-tight">
            <span className="text-gradient">Sssst...</span>{" "}
            <span className="inline-block" aria-hidden="true">🎀</span>
          </h1>
          <p className="text-[#9D4E6B] font-body font-medium text-base sm:text-lg leading-relaxed">
            Sabar ya, kejutannya belum boleh dibuka!
          </p>
          <p className="text-[#9D4E6B]/70 font-body text-sm">
            Kembali lagi tanggal{" "}
            <span className="font-bold text-[#FB7185]">21 Agustus 2026</span>
          </p>
        </div>

        {/* Sleeping chibi */}
        <SleepingChibi />

        {/* Countdown */}
        <div>
          <p className="text-center text-[#9D4E6B]/60 text-xs mb-4 tracking-widest uppercase font-semibold">
            Dibuka dalam...
          </p>
          <div className="flex gap-3 sm:gap-4">
            <TimeBlock value={timeLeft.days}    label="Hari" />
            <TimeBlock value={timeLeft.hours}   label="Jam" />
            <TimeBlock value={timeLeft.minutes} label="Menit" />
            <TimeBlock value={timeLeft.seconds} label="Detik" />
          </div>
        </div>
      </motion.div>

      {/* Hearts scattered */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 text-2xl pointer-events-none" aria-hidden="true">
        {["💕","🌸","💝","🌸","💕"].map((em, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          >
            {em}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function SealedGift() {
  return (
    <motion.div
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-20" aria-hidden="true">
        {/* Box */}
        <rect x="15" y="50" width="90" height="55" rx="8" fill="#FBCFE8" stroke="#F9A8D4" strokeWidth="2.5" />
        {/* Lid */}
        <rect x="10" y="40" width="100" height="18" rx="6" fill="#F9A8D4" stroke="#FB7185" strokeWidth="2.5" />
        {/* Vertical ribbon on box */}
        <rect x="57" y="50" width="6" height="55" fill="#FB7185" opacity="0.5" />
        {/* Horizontal ribbon on lid */}
        <rect x="10" y="46" width="100" height="6" fill="#FB7185" opacity="0.5" />
        {/* Bow left loop */}
        <ellipse cx="50" cy="35" rx="18" ry="12" fill="#FB7185" transform="rotate(-25 50 35)" />
        {/* Bow right loop */}
        <ellipse cx="70" cy="35" rx="18" ry="12" fill="#FB7185" transform="rotate(25 70 35)" />
        {/* Bow center */}
        <circle cx="60" cy="40" r="9" fill="#E11D48" />
        <circle cx="60" cy="40" r="5" fill="#FB7185" />
        {/* Lock */}
        <rect x="51" y="68" width="18" height="14" rx="3" fill="#FEF9F0" stroke="#FB7185" strokeWidth="2" />
        <path d="M55 68 Q55 60 60 60 Q65 60 65 68" stroke="#FB7185" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="75" r="2.5" fill="#FB7185" />
      </svg>
    </motion.div>
  );
}

function FloatingDecorations() {
  const items = [
    { emoji: "🌸", style: { top: "8%", left: "6%" }, delay: 0 },
    { emoji: "💕", style: { top: "12%", right: "8%" }, delay: 0.5 },
    { emoji: "⭐", style: { bottom: "15%", left: "10%" }, delay: 1 },
    { emoji: "🎀", style: { bottom: "20%", right: "6%" }, delay: 1.5 },
    { emoji: "✨", style: { top: "35%", left: "3%" }, delay: 0.8 },
    { emoji: "💫", style: { top: "40%", right: "4%" }, delay: 1.2 },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl sm:text-3xl select-none"
          style={item.style as React.CSSProperties}
          animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4 + i * 0.5, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
