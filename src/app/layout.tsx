import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans/standard.css";
import "lenis/dist/lenis.css";
import "@/styles/tokens.css";
import "@/styles/components.css";
import "@/styles/mocks.css";
import "@/styles/sections.css";
import { site } from "@/content/site";

const title = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: [
    "Frontend Engineer",
    "React Developer",
    "Next.js Developer",
    "Flutter Developer",
    "UI/UX Designer",
    "Creative Developer",
    "WebGL",
    "TypeScript",
    "Bangka Belitung",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: "Freelance" },
  address: { "@type": "PostalAddress", addressLocality: "Bangka Belitung", addressCountry: "ID" },
  sameAs: [site.github],
  email: site.email,
  knowsAbout: ["React", "Next.js", "TypeScript", "Flutter", "Figma", "GSAP", "Three.js", "WebGL"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
