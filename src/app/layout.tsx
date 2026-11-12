import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans/standard.css";
import "lenis/dist/lenis.css";
import "@/styles/tokens.css";
import "@/styles/components.css";
import "@/styles/mocks.css";
import "@/styles/sections.css";
import "@/styles/mobile.css";
import "@/styles/reduced-motion.css";
import { site } from "@/content/site";
import { paletteCss, paletteScript } from "@/lib/palettes";

const title = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: [
    "Flutter Developer",
    "Front-end Developer",
    "UI/UX Designer",
    "React Developer",
    "Next.js Developer",
    "Design Systems",
    "Jakarta",
    "Indonesia",
    site.name,
    "Portfolio",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script below sets data-accent on <html>
    // before React hydrates, so the server HTML and the DOM differ on purpose.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Accent palettes (src/lib/palettes.ts) and, before the first paint,
            the visitor's saved choice. */}
        <style dangerouslySetInnerHTML={{ __html: paletteCss }} />
        <script dangerouslySetInnerHTML={{ __html: paletteScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
