import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import CursorDot from "@/components/cursor-dot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Juliansyah | Portfolio",
  description: "Personal portfolio website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${bricolage.variable} ${instrumentSerif.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        <CursorDot />
        {children}
      </body>
    </html>
  );
}
