import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import About from "@/components/about";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}
