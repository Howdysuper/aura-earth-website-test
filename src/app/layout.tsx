import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Aura & Earth — Sustainable, Non-Toxic Candles & Home Goods",
  description:
    "Hand-poured, clean-burning soy candles and conscious home décor designed for modern living. Shop the collection or join the monthly candle box.",
  keywords: [
    "sustainable candles",
    "non-toxic candles",
    "soy candles",
    "candle subscription box",
    "eco-friendly home decor",
    "clean burning candles",
  ],
  openGraph: {
    title: "Aura & Earth — Conscious Candles for Modern Living",
    description:
      "Hand-poured, clean-burning soy candles and conscious home décor. Join the monthly candle box.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-cream text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
