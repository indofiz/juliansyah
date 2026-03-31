import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import CursorDot from "@/components/cursor-dot";

export default function Home() {
  return (
    <main className="min-h-screen">
      <CursorDot />
      <Navbar />
      <Hero />
      <Projects />
    </main>
  );
}
