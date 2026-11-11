import { SceneCanvas } from "@/components/SceneCanvas";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollScenes } from "@/components/ScrollScenes";
import { ScrollFx } from "@/components/ScrollFx";
import { Carousels } from "@/components/Carousels";
import { SiteHeader } from "@/components/SiteHeader";
import { Intro } from "@/components/sections/Intro";
import { Work } from "@/components/sections/Work";
import { DesignToCode } from "@/components/sections/DesignToCode";
import { Capabilities } from "@/components/sections/Capabilities";
import { Playground } from "@/components/sections/Playground";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { jsonLdHtml, personJsonLd } from "@/lib/jsonLd";

// Sections answer a visitor's questions in order: who are you (hero, proof),
// can you do what I need (work, design → code, what I do, playground),
// can I trust you (about, testimonials), how do I reach you (contact).
// Section ids must match the keys in src/lib/sceneKeyframes.ts (same order).
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(personJsonLd())} />
      <SceneCanvas />
      <SmoothScroll />
      <ScrollScenes />
      <ScrollFx />
      <Carousels />
      <SiteHeader />
      <main id="main-content">
        <Intro />
        <Work />
        <DesignToCode />
        <Capabilities />
        <Playground />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
