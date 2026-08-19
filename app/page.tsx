"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useLockScreen } from "./hooks/useLockScreen";
import { LockScreen } from "./components/LockScreen";
import { MusicPlayer } from "./components/MusicPlayer";


// Code-split heavy sections — only loaded after lock is unlocked
// Aligns with web-performance-optimization: dynamic imports, lazy loading
const HeroSection = dynamic(
  () => import("./components/HeroSection").then(m => ({ default: m.HeroSection })),
  { ssr: false }
);
const MessageSection = dynamic(
  () => import("./components/MessageSection").then(m => ({ default: m.MessageSection })),
  { ssr: false }
);
const Interactive3DSection = dynamic(
  () => import("./components/Interactive3DSection").then(m => ({ default: m.Interactive3DSection })),
  { ssr: false }
);
const CelebrationSection = dynamic(
  () => import("./components/CelebrationSection").then(m => ({ default: m.CelebrationSection })),
  { ssr: false }
);
const FooterSection = dynamic(
  () => import("./components/FooterSection").then(m => ({ default: m.FooterSection })),
  { ssr: false }
);

export default function BirthdayPage() {
  const { locked, timeLeft } = useLockScreen();

  return (
    <main className="flex flex-col flex-1">
      <AnimatePresence mode="wait">
        {locked ? (
          <LockScreen key="lock" timeLeft={timeLeft} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col flex-1"
          >
            <HeroSection />
            <MessageSection />
            <Interactive3DSection />
            <CelebrationSection />
            <FooterSection />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MusicPlayer — fixed overlay, tampil di semua state (lock & konten) */}
      <MusicPlayer />
    </main>
  );
}
