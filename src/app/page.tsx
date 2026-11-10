import { SceneCanvas } from "@/components/SceneCanvas";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollScenes } from "@/components/ScrollScenes";
import { ScrollFx } from "@/components/ScrollFx";
import { SiteHeader } from "@/components/SiteHeader";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Spotlight } from "@/components/sections/Spotlight";
import { Assistant } from "@/components/sections/Assistant";
import { Featured } from "@/components/sections/Featured";
import { Capabilities } from "@/components/sections/Capabilities";
import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";

// Section ids must match the keys in src/lib/sceneKeyframes.ts (same order).
// Pricing, Estimator and Portal exist in components/sections but aren't rendered.
export default function Home() {
  return (
    <>
      <SceneCanvas />
      <SmoothScroll />
      <ScrollScenes />
      <ScrollFx />
      <SiteHeader />
      <main id="main-content">
        <Intro />
        <Services />
        <Work />
        <Process />
        <Spotlight />
        <Assistant />
        <Featured />
        <Capabilities />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
