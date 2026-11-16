import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans/standard.css";
import "lenis/dist/lenis.css";
import "@/styles/tokens.css";
import "@/styles/components.css";
import "@/styles/mocks.css";
import "@/styles/sections.css";
import "@/styles/mobile.css";
import "@/styles/reduced-motion.css";
import { getContent } from "@/content";
import { clientContent } from "@/content/locale";
import { ContentProvider } from "@/components/ContentProvider";
import { languageAlternates, localeInfo, localHref, locales } from "@/lib/locales";
import { paletteCss, paletteScript } from "@/lib/palettes";

/** Both languages are prerendered: English at /, Indonesian at /id (src/proxy.ts). */
export function generateStaticParams() {
  return locales.map((l) => ({ lang: l.id }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { site, locale } = await getContent();
  const title = `${site.name} | ${site.role}`;
  return {
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
      "Pangkalpinang",
      "Bangka Belitung",
      "Indonesia",
      site.name,
      "Portfolio",
    ],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: localHref("/", locale), languages: languageAlternates("/") },
    openGraph: {
      type: "website",
      locale: localeInfo(locale).og,
      alternateLocale: locales.filter((l) => l.id !== locale).map((l) => l.og),
      url: localHref("/", locale),
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
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const t = await getContent();
  return (
    // suppressHydrationWarning: the script below sets data-accent on <html>
    // before React hydrates, so the server HTML and the DOM differ on purpose.
    <html lang={t.locale} suppressHydrationWarning>
      <head>
        {/* Accent palettes (src/lib/palettes.ts) and, before the first paint,
            the visitor's saved choice. */}
        <style dangerouslySetInnerHTML={{ __html: paletteCss }} />
        <script dangerouslySetInnerHTML={{ __html: paletteScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          {t.ui.skip}
        </a>
        <ContentProvider value={clientContent(t)}>{children}</ContentProvider>
      </body>
    </html>
  );
}
