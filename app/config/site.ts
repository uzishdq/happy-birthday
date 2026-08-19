/**
 * Central config for public environment variables.
 * Semua NEXT_PUBLIC_ env diakses di sini supaya tidak tersebar di banyak file.
 */
export const siteConfig = {
  recipientName: process.env.NEXT_PUBLIC_RECIPIENT_NAME ?? "Sayang",
  senderName:    process.env.NEXT_PUBLIC_SENDER_NAME    ?? "Kamu",
  /** Path ke file audio di /public, e.g. "/music/birthday.mp3". Kosong = tidak ada musik. */
  musicFile:     process.env.NEXT_PUBLIC_MUSIC_FILE     ?? "",
  /**
   * Posisi mulai musik dalam detik (bisa desimal).
   * Contoh: "90" = mulai dari menit 1:30, "125.5" = mulai dari 2:05.5
   * Default 0 = dari awal.
   */
  musicStartTime: Number(process.env.NEXT_PUBLIC_MUSIC_START_TIME ?? 0),
} as const;

