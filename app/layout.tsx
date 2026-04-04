import type { Metadata } from "next";
import { Bricolage_Grotesque, Dancing_Script, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import CursorDot from "@/components/cursor-dot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const BASE_URL = "https://juliansyah.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Juliansyah | Frontend Engineer",
    template: "%s | Juliansyah",
  },
  description:
    "Frontend Engineer with a design edge. I build pixel-perfect, production-ready web interfaces — from landing pages to full-stack applications.",
  keywords: [
    "Frontend Engineer",
    "React Developer",
    "Next.js Developer",
    "UI Developer",
    "Web Developer",
    "JavaScript",
    "TypeScript",
    "Tailwind CSS",
    "Jakarta",
    "Indonesia",
    "Juliansyah",
    "Portfolio",
  ],
  authors: [{ name: "Juliansyah", url: BASE_URL }],
  creator: "Juliansyah",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Juliansyah",
    title: "Juliansyah | Frontend Engineer",
    description:
      "Frontend Engineer with a design edge. I build pixel-perfect, production-ready web interfaces — from landing pages to full-stack applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Juliansyah — Frontend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juliansyah | Frontend Engineer",
    description:
      "Frontend Engineer with a design edge. Building fast, intentional web products.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Juliansyah",
  url: BASE_URL,
  jobTitle: "Frontend Engineer",
  worksFor: { "@type": "Organization", name: "Freelance" },
  address: { "@type": "PostalAddress", addressLocality: "Jakarta", addressCountry: "ID" },
  sameAs: ["https://github.com/indofiz"],
  email: "hello@juliansyah.dev",
  knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Figma"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${bricolage.variable} ${dancingScript.variable} ${instrumentSerif.variable} font-(family-name:--font-inter) antialiased`}
      >
        {/* Skip to main content — keyboard/screen-reader navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#060703] focus:outline-none"
        >
          Skip to main content
        </a>
        <CursorDot />
        {children}
      </body>
    </html>
  );
}
