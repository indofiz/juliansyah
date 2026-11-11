import { SceneCanvas } from "@/components/SceneCanvas";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollScenes } from "@/components/ScrollScenes";
import { ScrollFx } from "@/components/ScrollFx";
import { Carousels } from "@/components/Carousels";
import { SiteHeader } from "@/components/SiteHeader";
import { Intro } from "@/components/sections/Intro";
import { Work } from "@/components/sections/Work";
import { DesignToCode } from "@/components/sections/DesignToCode";
import { Assistant } from "@/components/sections/Assistant";
import { Featured } from "@/components/sections/Featured";
import { Capabilities } from "@/components/sections/Capabilities";
import { Playground } from "@/components/sections/Playground";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { jsonLdHtml, personJsonLd } from "@/lib/jsonLd";

// Section ids must match the keys in src/lib/sceneKeyframes.ts (same order).
// Pricing, Estimator and Portal exist in components/sections but aren't rendered.
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
        <Assistant />
        <Featured />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
