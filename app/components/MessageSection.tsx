"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../config/site";

const MESSAGE_LINES = [
  "Selamat ulang tahun! 🎉",
  "",
  "Hari ini aku cuma mau bilang, aku bersyukur banget kamu ada di duniaku.",
  "Makasih udah jadi orang yang selalu bikin hari-hariku lebih hangat,",
  "lebih lucu, dan lebih berarti — bahkan di hari-hari yang berantakan sekalipun.",
  "",
  "Semoga tahun ini kamu makin bahagia, makin disayang, dan semua",
  "mimpi-mimpi kecil maupun besar kamu pelan-pelan jadi kenyataan.",
  "Aku akan selalu ada, entah buat rayain hal-hal seru bareng",
  "atau cuma buat dengerin cerita random kamu.",
  "",
  "Terima kasih sudah jadi kamu. Selamat ulang tahun...... 🥰🎂",
];

export function MessageSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);

  // Intersection observer for reveal
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

  return (
    <section
      ref={ref}
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-20 relative"
      style={{ background: "linear-gradient(180deg, #FEF9F0 0%, #FDF2F8 100%)" }}
      aria-label="Pesan ulang tahun"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-10 space-y-2"
      >
        <p className="text-[#9D4E6B]/60 text-xs font-body font-semibold tracking-widest uppercase">
          Surat Kecilku
        </p>
        <h2 className="font-script text-4xl sm:text-5xl">
          <span className="text-gradient">Pesan Untukmu</span>{" "}
          <span className="inline-block" aria-hidden="true">💌</span>
        </h2>
      </motion.div>

      {/* Flip card container */}
      <div
        className="w-full max-w-md sm:max-w-lg perspective-[1000px]"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
          style={{ transformStyle: "preserve-3d", transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        >
          {/* Card front — envelope style */}
          <div className={`clay-card p-6 sm:p-8 relative overflow-hidden transition-all duration-700 ${flipped ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {/* Paper texture lines */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute left-8 right-8 border-b border-pink-100"
                style={{ top: `${60 + i * 32}px` }}
              />
            ))}

            {/* Decorative stamp */}
            <div className="absolute top-4 right-4 w-12 h-14 border-2 border-[#F9A8D4] rounded flex flex-col items-center justify-center bg-pink-50">
              <span className="text-lg" aria-hidden="true">💌</span>
              <div className="w-8 h-0.5 bg-[#F9A8D4] mt-1" />
              <div className="w-6 h-0.5 bg-[#F9A8D4] mt-0.5" />
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-pink-300 to-transparent" />
                <span className="text-[#9D4E6B]/50 text-xs font-body tracking-widest uppercase">Untuk {siteConfig.recipientName}</span>
              </div>

              <p className="font-body text-[#4A1D2E] text-base sm:text-lg leading-relaxed line-clamp-6">
                Selamat ulang tahun! 🎉 Hari ini aku cuma mau bilang, aku bersyukur
                banget kamu ada di duniaku. Makasih udah jadi orang yang selalu bikin
                hari-hariku lebih hangat...
              </p>

              <motion.button
                onClick={() => setFlipped(true)}
                className="clay-btn mt-4 px-6 py-3 bg-gradient-to-r from-[#FB7185] to-[#F472B6] text-white font-body font-semibold text-sm flex items-center gap-2 mx-auto cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Baca surat lengkap"
              >
                <span>Baca selengkapnya</span>
                <span aria-hidden="true">→</span>
              </motion.button>
            </div>
          </div>

          {/* Card back — full letter */}
          <AnimatePresence>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="clay-card p-6 sm:p-8 relative overflow-hidden"
              >
                {/* Paper lines */}
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-8 right-8 border-b border-pink-100/70"
                    style={{ top: `${64 + i * 30}px` }}
                  />
                ))}

                {/* Red margin line */}
                <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-200/60" />

                <div className="relative z-10 space-y-1 pl-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[#9D4E6B]/50 text-xs font-body tracking-widest uppercase">Surat Spesial</span>
                    <motion.button
                      onClick={() => setFlipped(false)}
                      className="text-[#9D4E6B]/40 text-xs hover:text-[#FB7185] transition-colors cursor-pointer"
                      aria-label="Kembali"
                    >
                      ← kembali
                    </motion.button>
                  </div>

                  {MESSAGE_LINES.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`font-body text-[#4A1D2E] leading-relaxed ${
                        line === "" ? "h-3" : "text-sm sm:text-base"
                      } ${i === 0 ? "font-bold text-lg text-[#FB7185]" : ""}`}
                    >
                      {line}
                    </motion.p>
                  ))}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: MESSAGE_LINES.length * 0.06 + 0.3 }}
                    className="pt-4 flex items-center gap-2"
                  >
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-pink-200 to-transparent" />
                    <span className="font-script text-2xl text-gradient">dengan sayang 💕</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Decorative floating hearts */}
      <div className="absolute bottom-6 left-6 opacity-30" aria-hidden="true">
        {["💝","💕","💗"].map((h, i) => (
          <motion.div
            key={i}
            className="text-2xl absolute"
            style={{ left: i * 28 }}
            animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            {h}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
