import { SceneCanvas } from "@/components/SceneCanvas";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollScenes } from "@/components/ScrollScenes";
import { ScrollFx } from "@/components/ScrollFx";
import { Carousels } from "@/components/Carousels";
import { SiteHeader } from "@/components/SiteHeader";
import { ChatButton } from "@/components/ChatButton";
import { Intro } from "@/components/sections/Intro";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
// Hidden for launch: Playground. Uncomment to bring the section back.
// import { Playground } from "@/components/sections/Playground";
import { About } from "@/components/sections/About";
// Hidden for launch: Kind words (testimonials). Uncomment to bring the section back.
// import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { getContent } from "@/content";
import { jsonLdHtml, personJsonLd } from "@/lib/jsonLd";

// Sections answer a visitor's questions in order: who are you (hero, proof),
// can you do what I need (work, how I work, about: me and what I do,
// playground), can I trust you (testimonials), how do I reach you (contact).
// Section ids must match the keys in src/lib/sceneKeyframes.ts (same order).
// Playground and Kind words are hidden for launch (search "Hidden for launch"
// to find every place to uncomment when they come back).
export default async function Home() {
  const t = await getContent();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(personJsonLd(t))} />
      <SceneCanvas />
      <SmoothScroll />
      <ScrollScenes />
      <ScrollFx />
      <Carousels />
      <SiteHeader path="/" />
      <main id="main-content">
        <Intro />
        <Work />
        <Process />
        <About />
        {/* Hidden for launch: Playground and Kind words. */}
        {/* <Playground /> */}
        {/* <Testimonials /> */}
        <Contact />
      </main>
      <Footer />
      <ChatButton />
    </>
  );
}
