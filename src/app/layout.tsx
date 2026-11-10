import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans/standard.css";
import "lenis/dist/lenis.css";
import "@/styles/tokens.css";
import "@/styles/components.css";
import "@/styles/mocks.css";
import "@/styles/sections.css";

export const metadata: Metadata = {
  title: "Your Name — Creative Developer",
  description: "Creative development and real-time 3D for the web.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
