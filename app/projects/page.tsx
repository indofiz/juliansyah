import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import AllProjects from "@/components/all-projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work by Juliansyah — frontend engineering, UI/UX design, and Flutter mobile apps built with React, Next.js, TypeScript, and Dart.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Juliansyah",
    description:
      "A portfolio of frontend, UI/UX, and Flutter mobile projects.",
  },
};

export default function ProjectsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />
      <AllProjects />
    </main>
  );
}
