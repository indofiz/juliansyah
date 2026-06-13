import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import AboutPage from "@/components/about-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Juliansyah — a frontend engineer and UI/UX designer based in Bangka Belitung, building web interfaces with React & Next.js and mobile apps with Flutter.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Juliansyah",
    description:
      "Frontend engineer & UI/UX designer based in Bangka Belitung, Indonesia — web and Flutter mobile.",
  },
};

export default function Page() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />
      <AboutPage />
    </main>
  );
}
