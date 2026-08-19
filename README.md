# 🎂 Sweet Happy Birthday Website

Website ucapan **Happy Birthday** interaktif, romantis, dan lucu (*cute & playful*) yang dibangun dengan **Next.js (App Router)**, **Tailwind CSS**, **Framer Motion**, dan **Web Audio API**.

---

## ✨ Fitur Utama

- 🔒 **Lock Screen / Gerbang Waktu Countdown**
  - Website otomatis terkunci dengan countdown karakter chibi tidur dan kotak kado tersegel sampai tanggal & jam yang ditentukan (misal: 21 Agustus, 00:00 WIB).
  - Begitu waktu tercapai, halaman otomatis terbuka (*unlock*) tanpa perlu refresh.

- 💌 **Opening Screen / Interactive Envelope**
  - Amplop interaktif dengan efek suara *chime* manis dan semburan *confetti*.
  - Menampilkan surat yang muncul dari dalam amplop beserta ucapan pembuka dan badge harapan.

- 📜 **Love Message Section**
  - Surat ucapan personal dalam bentuk kartu pos / amplop flip yang manis.

- 🎁 **Elemen 3D Interaktif (3D Gift Box)**
  - Kotak kado 3D murni CSS yang bisa diputar / di-*drag* dengan pointer/sentuhan dan diklik untuk membuka kejutan spesial.

- 🎈 **Pop the Balloons (Layar Penuh & Ultra Meriah)**
  - Efek balon melayang yang menutupi seluruh layar dengan animasi *sway* alami.
  - Setiap balon yang di-*tap* mengeluarkan suara letupan (*Web Audio API*), getaran (*haptic*), dan semburan partikel bintang confetti tepat di titik sentuhan.
  - *Grand Finale Celebration* ketika semua balon berhasil dipecahkan + tombol untuk meniup balon lagi.

- 🕯️ **Tiup Lilin & Confetti Celebration**
  - Kue ulang tahun dengan lilin menyala yang bisa ditiup (menghasilkan asap lembut dan semburan meriam confetti multi-arah).

- 🎵 **Floating Music Player**
  - Pemutar musik estetik dengan tombol play/pause, pengatur volume, mute, dan *floating musical notes*.
  - Mendukung konfigurasi posisi mulai lagu (*start time* dalam detik) dan loop otomatis kembali ke detik yang ditentukan.

- 💝 **Footer & Tanda Tangan**
  - Tanda tangan pengirim, tanggal spesial, dan jejak hati melayang (*heart trail*).

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS (Claymorphism & Soft Pastel Theme)
- **Animasi**: Framer Motion
- **Efek Partikel**: canvas-confetti
- **Audio Effects**: Web Audio API (Synthesized pop & chime)
- **Tipografi**: Dancing Script (Heading) & Nunito (Body)

---

## ⚙️ Konfigurasi Environment Variables

Buat file `.env.local` di direktori root (atau salin dari `.env.example`):

```env
# Nama penerima & pengirim ucapan
NEXT_PUBLIC_RECIPIENT_NAME="Sayang"
NEXT_PUBLIC_SENDER_NAME="Kamu"

# Path file audio di dalam folder public/music/ (kosongkan jika tanpa musik)
NEXT_PUBLIC_MUSIC_FILE="/music/Perunggu-Ini-Abadi.mp3"

# Mulai musik dari detik ke-berapa (contoh: 63 = menit 1:03, 0 = dari awal)
NEXT_PUBLIC_MUSIC_START_TIME=63
```

---

## 🚀 Memulai (Getting Started)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```

3. Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

4. **Build untuk Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📂 Struktur Project

```
├── app/
│   ├── components/
│   │   ├── CelebrationSection.tsx   # Tiup lilin & confetti
│   │   ├── FooterSection.tsx        # Signature & heart trail
│   │   ├── HeroSection.tsx          # Amplop pembuka & greeting
│   │   ├── Interactive3DSection.tsx # Kado 3D & Pop Balloons
│   │   ├── LockScreen.tsx           # Countdown lock screen
│   │   ├── MessageSection.tsx       # Surat pesan cinta
│   │   ├── MusicPlayer.tsx          # Pemutar musik floating
│   │   └── types.ts
│   ├── config/
│   │   └── site.ts                  # Konfigurasi env public
│   ├── hooks/
│   │   └── useLockScreen.ts         # Hook hitung mundur waktu unlock
│   ├── globals.css                  # Custom claymorphism & theme
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── music/                       # Folder file audio/mp3
├── .env.example
├── .env.local
└── README.md
```
