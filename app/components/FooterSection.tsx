"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "../config/site";

const HEART_TRAIL = ["💕", "💗", "💝", "💖", "🌸", "✨", "💫", "⭐"];

export function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FDF2F8 0%, #FEF9F0 100%)" }}
      aria-label="Penutup"
    >
      {/* Heart trail decoration */}
      <HeartTrail />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-sm mx-auto text-center flex flex-col items-center gap-6"
      >
        {/* Signature card */}
        <div className="clay-card p-8 w-full relative overflow-hidden">
          {/* Paper texture lines */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute left-6 right-6 border-b border-pink-100/80" style={{ top: `${70 + i * 28}px` }} />
          ))}

          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Animated heart */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl"
              aria-hidden="true"
            >
              💝
            </motion.div>

            <div className="space-y-1 text-center">
              <p className="text-[#9D4E6B]/60 text-xs font-body font-semibold tracking-widest uppercase">
                Dengan sepenuh hati
              </p>
              <p className="font-script text-4xl text-gradient leading-tight">
                dari {siteConfig.senderName}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent to-pink-200" />
              <span className="text-[#F9A8D4] text-sm" aria-hidden="true">✦</span>
              <div className="flex-1 h-0.5 bg-gradient-to-l from-transparent to-pink-200" />
            </div>

            {/* Date */}
            <div className="text-center">
              <p className="font-script text-2xl text-[#FB7185]">21 Agustus 2026</p>
              <p className="text-[#9D4E6B]/50 text-xs font-body mt-1">Hari yang paling spesial 🎀</p>
            </div>

            {/* Little cute sticker */}
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#FB7185] to-[#C084FC] rounded-full flex items-center justify-center text-lg shadow-lg"
              aria-hidden="true"
            >
              🌸
            </motion.div>
          </div>
        </div>

        {/* Heart trail footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="flex gap-2 flex-wrap justify-center"
          aria-hidden="true"
        >
          {HEART_TRAIL.map((em, i) => (
            <motion.span
              key={i}
              className="text-xl sm:text-2xl cursor-default select-none"
              animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2 + i * 0.2, delay: i * 0.15, repeat: Infinity }}
            >
              {em}
            </motion.span>
          ))}
        </motion.div>

        {/* Tiny footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-[#9D4E6B]/40 text-xs font-body text-center leading-relaxed"
        >
          Dibuat dengan 💕 dan banyak rasa sayang
        </motion.p>
      </motion.div>
    </section>
  );
}

// ── Heart trail SVG decoration ────────────────────────────────────────────
function HeartTrail() {
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    x: `${8 + i * 8}%`,
    y: `${20 + Math.sin(i) * 30}%`,
    size: 10 + Math.random() * 10,
    delay: i * 0.15,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {hearts.map((h, i) => (
        <motion.div
          key={i}
          className="absolute text-[#F9A8D4] select-none"
          style={{ left: h.x, top: h.y, fontSize: h.size, opacity: h.opacity }}
          animate={{ y: [0, -8, 0], opacity: [h.opacity, h.opacity * 2, h.opacity] }}
          transition={{ duration: 4 + i * 0.3, delay: h.delay, repeat: Infinity }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}
