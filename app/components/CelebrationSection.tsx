"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";


// Lazy-load canvas-confetti for performance (code split)
async function fireConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#FB7185", "#F9A8D4", "#C084FC", "#FDBA74", "#60A5FA", "#FDE68A"];

  // Initial burst
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors,
    shapes: ["circle", "square"],
    scalar: 1.2,
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
  }, 200);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 400);

  // Final burst
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { y: 0.4 },
      colors,
      startVelocity: 35,
    });
  }, 700);
}

export function CelebrationSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [blown, setBlown] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

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

  const handleBlow = useCallback(async () => {
    if (blown) return;
    setCandlesLit(false);
    await new Promise(r => setTimeout(r, 600));
    setBlown(true);
    setShowMessage(true);
    await fireConfetti();
  }, [blown]);

  const CANDLES = [0, 1, 2, 3, 4];

  return (
    <section
      ref={ref}
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EDE9FE 0%, #FDF2F8 100%)" }}
      aria-label="Tiup lilin ulang tahun"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-10 space-y-2"
      >
        <p className="text-[#9D4E6B]/60 text-xs font-body font-semibold tracking-widest uppercase">
          Momen Spesial
        </p>
        <h2 className="font-script text-4xl sm:text-5xl">
          <span className="text-gradient">Tiup Lilinnya!</span>{" "}
          <span className="inline-block" aria-hidden="true">🕯️</span>
        </h2>
      </motion.div>

      {/* Birthday Cake */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={visible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 120 }}
        className="relative"
      >
        <BirthdayCake candles={CANDLES} lit={candlesLit} />
      </motion.div>

      {/* Blow button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-10 text-center"
      >
        <AnimatePresence mode="wait">
          {!blown ? (
            <motion.button
              key="blow"
              className="clay-btn px-8 py-4 bg-gradient-to-r from-[#FB7185] to-[#F472B6] text-white font-body font-bold text-lg flex items-center gap-3 mx-auto cursor-pointer"
              onClick={handleBlow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              exit={{ opacity: 0, scale: 0.8 }}
              aria-label="Tiup lilin"
            >
              <span className="text-2xl" aria-hidden="true">🎂</span>
              <span>Tiup Lilin!</span>
              <span className="text-2xl" aria-hidden="true">✨</span>
            </motion.button>
          ) : (
            <motion.div
              key="blown"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="font-script text-3xl sm:text-4xl"
            >
              <span className="text-gradient">Yeay!!</span>{" "}
              <span>🎊🎉🎊</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Special message popup */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 180 }}
            className="clay-card mt-8 p-6 sm:p-8 text-center max-w-sm mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="text-5xl mb-4"
              aria-hidden="true"
            >
              🥰
            </motion.div>
            <p className="font-script text-3xl text-gradient mb-3">
              Semoga Terkabul!
            </p>
            <p className="font-body text-[#4A1D2E] text-sm sm:text-base leading-relaxed">
              Semua harapan dan mimpimu — semoga satu per satu jadi kenyataan.
              Aku akan selalu disini mendukungmu! 💕
            </p>

            {/* Re-trigger button */}
            <motion.button
              onClick={async () => { await fireConfetti(); }}
              className="clay-btn mt-4 px-5 py-2 bg-white text-[#FB7185] font-body font-semibold text-sm border-[#F9A8D4] cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Confetti lagi!"
            >
              🎉 Confetti lagi!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Birthday Cake SVG ──────────────────────────────────────────────────────
function BirthdayCake({ candles, lit }: { candles: number[]; lit: boolean }) {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-56 h-52 sm:w-72 sm:h-64" aria-label="Kue ulang tahun" role="img">
      {/* Plate */}
      <ellipse cx="140" cy="245" rx="105" ry="12" fill="#FDE8EF" />

      {/* Bottom tier */}
      <rect x="30" y="175" width="220" height="65" rx="14" fill="#FBCFE8" stroke="#F9A8D4" strokeWidth="2.5" />
      <rect x="30" y="175" width="220" height="22" rx="14" fill="#F9A8D4" />
      {/* Dots decoration bottom */}
      {[55, 95, 140, 185, 225].map(x => (
        <circle key={x} cx={x} cy={219} r="5" fill="#FB7185" opacity="0.6" />
      ))}

      {/* Middle tier */}
      <rect x="60" y="115" width="160" height="65" rx="12" fill="#FDE8EF" stroke="#F9A8D4" strokeWidth="2.5" />
      <rect x="60" y="115" width="160" height="20" rx="12" fill="#FBCFE8" />
      {/* Swirl decoration middle */}
      <path d="M80 148 Q110 135 140 148 Q170 161 200 148" stroke="#FB7185" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* Top tier */}
      <rect x="90" y="65" width="100" height="55" rx="10" fill="#FBCFE8" stroke="#F9A8D4" strokeWidth="2.5" />
      <rect x="90" y="65" width="100" height="18" rx="10" fill="#F9A8D4" />

      {/* Frosting drips */}
      {[100, 120, 145, 168].map((x, i) => (
        <path key={i} d={`M${x} 83 Q${x + 5} 95 ${x + 2} 100`} stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.6" fill="none" />
      ))}
      {[45, 75, 110, 145, 180, 210, 240].map((x, i) => (
        <path key={i} d={`M${x} 135 Q${x + 5} 150 ${x + 2} 155`} stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.5" fill="none" />
      ))}

      {/* Candles */}
      {candles.map((_, i) => {
        const cx = 105 + i * 18;
        return (
          <g key={i}>
            {/* Candle body */}
            <rect x={cx - 4} y="40" width="8" height="28" rx="4" fill={["#FB7185","#C084FC","#60A5FA","#34D399","#FBBF24"][i]} />
            {/* Flame */}
            <AnimatePresence>
              {lit && (
                <motion.g
                  key="flame"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.1, 0.95, 1], y: [0, -2, 0] }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ scale: { duration: 0.6, repeat: Infinity }, y: { duration: 0.4, repeat: Infinity } }}
                >
                  <ellipse cx={cx} cy="34" rx="5" ry="8" fill="#FBBF24" />
                  <ellipse cx={cx} cy="32" rx="3" ry="5" fill="#FEF9C3" />
                </motion.g>
              )}
            </AnimatePresence>
            {/* Smoke when blown out */}
            <AnimatePresence>
              {!lit && (
                <motion.g
                  key="smoke"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.5, 0], y: -12 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                >
                  <circle cx={cx} cy="30" r="3" fill="#D1D5DB" opacity="0.5" />
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        );
      })}

      {/* Decorative stars */}
      {[[30, 70], [250, 80], [20, 160], [260, 160]].map(([x, y], i) => (
        <text key={i} x={x} y={y} fontSize="16" fill="#F9A8D4" opacity="0.6" fontFamily="sans-serif">✦</text>
      ))}
    </svg>
  );
}
