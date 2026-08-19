import type { Metadata, Viewport } from "next";
import { Dancing_Script, Nunito } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Birthday 🎂",
  description: "A special birthday surprise just for you 🎀",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9A8D4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${dancingScript.variable} ${nunito.variable} h-full`}
    >
      <body className="font-body antialiased min-h-full flex flex-col bg-[#FEF9F0]">
        {children}
      </body>
    </html>
  );
}

