"use client";

import { useEffect, useState } from "react";
import type { TimeLeft } from "../components/types";

// 20 Agustus jam 12 malam teng (21 Agustus 00:00:00 WIB = 20 Agustus 17:00:00 UTC)
const UNLOCK_DATE_UTC = new Date("2026-08-21T00:00:00+07:00");

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = UNLOCK_DATE_UTC.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export function useLockScreen(): { locked: boolean; timeLeft: TimeLeft } {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [locked, setLocked] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tl = getTimeLeft();
    setTimeLeft(tl);
    const total = tl.days + tl.hours + tl.minutes + tl.seconds;
    setLocked(total > 0);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const tl = getTimeLeft();
      setTimeLeft(tl);
      const total = tl.days + tl.hours + tl.minutes + tl.seconds;
      if (total <= 0) {
        setLocked(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  return { locked, timeLeft };
}
