"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../config/site";

// Cute chime sound when opening envelope
function playEnvelopeSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.15); // C6

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Ignore audio policy errors
  }
}

// Confetti burst on envelope open
async function fireEnvelopeBurst() {
  try {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.55 },
      colors: ["#FB7185", "#F472B6", "#C084FC", "#FDBA74", "#FEF9C3", "#67E8F9"],
      scalar: 1.1,
    });
  } catch {}
}

// ── Envelope + Hero Section ────────────────────────────────────────────────
export function HeroSection() {
  const [opened, setOpened] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleOpen = useCallback(() => {
    if (!opened) {
      setOpened(true);
      playEnvelopeSound();
      fireEnvelopeBurst();
    }
  }, [opened]);

  const scrollToMessage = () => {
    const nextSection = document.querySelector("section[aria-label='Pesan ulang tahun']");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(170deg, #FDF2F8 0%, #FEF9F0 60%, #EDE9FE 100%)" }}
      aria-label="Halaman utama"
    >
      <FloatingParticles />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl w-full text-center">
        {/* Title before open */}
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="unopened-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              className="space-y-2"
            >
              <p className="text-[#9D4E6B]/70 font-body font-semibold text-sm tracking-widest uppercase">
                Ada sesuatu untukmu 🎀
              </p>
              <h1 className="font-script text-5xl sm:text-6xl text-gradient leading-tight">
                Klik amplop-nya!
              </h1>
            </motion.div>
          ) : (
            <motion.div
              key="opened-header"
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
              className="space-y-1"
            >
              <span className="inline-block px-3 py-1 bg-pink-100/90 text-[#FB7185] text-xs font-body font-bold rounded-full tracking-wider uppercase shadow-xs">
                ✨ Special Birthday Edition ✨
              </span>
              <p className="text-[#9D4E6B]/60 text-xs font-body tracking-wider uppercase mt-1">
                Hari ini harimu yang paling istimewa
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Envelope */}
        <EnvelopeCard
          opened={opened}
          hovered={hovered}
          onOpen={handleOpen}
          onHover={setHovered}
        />

        {/* Revealed content when opened */}
        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 180, damping: 20 }}
              className="w-full flex flex-col items-center gap-5 mt-1"
            >
              {/* Main Birthday Greeting */}
              <div className="space-y-2">
                <motion.h1
                  className="font-script text-4xl sm:text-6xl leading-tight"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <span className="text-gradient">Happy Birthday, {siteConfig.recipientName}!</span>{" "}
                  <span className="inline-block" aria-hidden="true">🎉</span>
                </motion.h1>
                <motion.p
                  className="font-body text-[#9D4E6B] text-base sm:text-lg font-medium leading-relaxed max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Semoga hari ini dan seterusnya dipenuhi tawa ceria, cinta hangat, dan semua mimpi indahmu terwujud nyata. 🎂💕
                </motion.p>
              </div>

              {/* 3 Cute Wish Badges */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-1"
              >
                {[
                  { icon: "🌸", text: "Makin Bahagia" },
                  { icon: "✨", text: "Selalu Bersinar" },
                  { icon: "💖", text: "Penuh Kasih" },
                  { icon: "🎁", text: "Impian Terwujud" },
                ].map((badge, idx) => (
                  <span
                    key={idx}
                    className="clay-card px-3 py-1.5 text-xs sm:text-sm font-body font-semibold text-[#4A1D2E] flex items-center gap-1.5 bg-white/90 shadow-xs"
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </span>
                ))}
              </motion.div>

              {/* Scroll / Read Letter Button */}
              <motion.div
                className="mt-2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <button
                  onClick={scrollToMessage}
                  className="clay-btn px-6 py-2.5 bg-white text-[#FB7185] hover:text-[#E11D48] text-xs sm:text-sm font-body font-bold flex items-center gap-2 border-pink-200 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <span>Baca Pesan Spesial</span>
                  <span className="text-base">💌</span>
                  <span>↓</span>
                </button>
                <p className="text-[#9D4E6B]/50 text-[11px] font-body">scroll ke bawah untuk kejutan berikutnya</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Envelope Card ─────────────────────────────────────────────────────────
interface EnvelopeProps {
  opened: boolean;
  hovered: boolean;
  onOpen: () => void;
  onHover: (v: boolean) => void;
}

function EnvelopeCard({ opened, hovered, onOpen, onHover }: EnvelopeProps) {
  return (
    <motion.button
      onClick={onOpen}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      disabled={opened}
      className="relative focus-visible:outline-none cursor-pointer"
      whileHover={!opened ? { scale: 1.05 } : {}}
      whileTap={!opened ? { scale: 0.96 } : {}}
      animate={!opened ? { y: [0, -8, 0] } : {}}
      transition={!opened ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
      aria-label={opened ? "Amplop sudah dibuka" : "Klik untuk membuka amplop"}
    >
      <svg
        viewBox="0 0 300 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-64 h-48 sm:w-80 sm:h-60 drop-shadow-xl overflow-visible"
      >
        {/* Envelope body */}
        <rect x="10" y="70" width="280" height="140" rx="16" fill="#FECDD3" stroke="#FB7185" strokeWidth="3" />

        {/* Envelope bottom fold lines */}
        <path d="M10 210 L150 130 L290 210" stroke="#FCA5A5" strokeWidth="2" fill="none" />
        <path d="M10 70 L150 130 L290 70" stroke="#FCA5A5" strokeWidth="1.5" fill="none" />

        {/* Lid / flap - animated */}
        <motion.g
          initial={{ scaleY: 1, originY: "70px" }}
          animate={opened ? {
            rotateX: -180,
            transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
          } : hovered ? {
            scaleY: 0.92,
            transition: { duration: 0.3 }
          } : {
            scaleY: 1,
            transition: { duration: 0.3 }
          }}
          style={{ transformOrigin: "center top", transformBox: "fill-box" }}
        >
          <path
            d="M10 70 L150 150 L290 70 Q290 55 275 55 L25 55 Q10 55 10 70Z"
            fill="#FB7185"
            stroke="#FB7185"
            strokeWidth="1"
          />
          {/* Seal / heart on lid */}
          {!opened && (
            <motion.g
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <circle cx="150" cy="98" r="18" fill="#FEF9F0" />
              <path
                d="M150 107 C145 100 137 97 137 90 C137 85 141 82 145 82 C147 82 149 83 150 85 C151 83 153 82 155 82 C159 82 163 85 163 90 C163 97 155 100 150 107Z"
                fill="#FB7185"
              />
            </motion.g>
          )}
        </motion.g>

        {/* Letter popping out when opened - with rich illustrations & stamp */}
        <AnimatePresence>
          {opened && (
            <motion.g
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 15, opacity: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 160, damping: 18 }}
            >
              {/* Paper card */}
              <rect
                x="45" y="10" width="210" height="135" rx="12"
                fill="#FFFDF9"
                stroke="#F9A8D4"
                strokeWidth="2.5"
              />
              {/* Header stamp inside letter */}
              <rect x="210" y="20" width="32" height="38" rx="4" fill="#FDE8EF" stroke="#FB7185" strokeWidth="1.5" />
              <text x="226" y="44" fontSize="16" textAnchor="middle">💌</text>

              {/* Decorative greeting on letter */}
              <text x="65" y="38" fontSize="11" fontWeight="bold" fill="#9D4E6B" fontFamily="sans-serif" letterSpacing="1">
                FOR YOU
              </text>
              <text x="65" y="58" fontSize="15" fontWeight="bold" fill="#E11D48" fontFamily="cursive, sans-serif">
                Happy Birthday! 🎂
              </text>

              {/* Mini lines on letter */}
              <line x1="65" y1="72" x2="200" y2="72" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
              <line x1="65" y1="84" x2="190" y2="84" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
              <line x1="65" y1="96" x2="170" y2="96" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />

              {/* Heart badge inside */}
              <circle cx="75" cy="118" r="8" fill="#FBCFE8" />
              <text x="75" y="122" fontSize="10" textAnchor="middle">💕</text>
              <text x="90" y="122" fontSize="10" fill="#9D4E6B" fontWeight="600" fontFamily="sans-serif">
                With all my love ✨
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Decorative dots on envelope bottom */}
        {[0, 1, 2].map(i => (
          <circle
            key={i}
            cx={80 + i * 70}
            cy={180}
            r="4"
            fill="#FB7185"
            opacity="0.4"
          />
        ))}
      </svg>

      {/* Hover hint */}
      {!opened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-body text-[#9D4E6B]/70 font-medium"
        >
          Buka yuk! 💌
        </motion.div>
      )}
    </motion.button>
  );
}

// ── Floating background particles ────────────────────────────────────────
function FloatingParticles() {
  const particles = [
    { char: "✨", x: "5%",  y: "10%", delay: 0,   size: "text-2xl" },
    { char: "🌸", x: "88%", y: "8%",  delay: 0.7, size: "text-3xl" },
    { char: "💕", x: "15%", y: "75%", delay: 1.2, size: "text-xl"  },
    { char: "⭐", x: "80%", y: "70%", delay: 0.4, size: "text-2xl" },
    { char: "🦋", x: "3%",  y: "50%", delay: 1.8, size: "text-xl"  },
    { char: "💫", x: "92%", y: "45%", delay: 0.9, size: "text-xl"  },
    { char: "🌺", x: "50%", y: "5%",  delay: 1.5, size: "text-2xl" },
    { char: "💝", x: "70%", y: "88%", delay: 2,   size: "text-3xl" },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute select-none ${p.size}`}
          style={{ left: p.x, top: p.y }}
          animate={{ y: [0, -16, 0], rotate: [0, 15, -15, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4 + i * 0.4, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
}
