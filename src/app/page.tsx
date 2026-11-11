import { SceneCanvas } from "@/components/SceneCanvas";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollScenes } from "@/components/ScrollScenes";
import { ScrollFx } from "@/components/ScrollFx";
import { Carousels } from "@/components/Carousels";
import { SiteHeader } from "@/components/SiteHeader";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Pricing } from "@/components/sections/Pricing";
import { Estimator } from "@/components/sections/Estimator";
import { Process } from "@/components/sections/Process";
import { Spotlight } from "@/components/sections/Spotlight";
import { Assistant } from "@/components/sections/Assistant";
import { Featured } from "@/components/sections/Featured";
import { Capabilities } from "@/components/sections/Capabilities";
import { Portal } from "@/components/sections/Portal";
import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";

// Section ids must match the keys in src/lib/sceneKeyframes.ts (same order).
export default function Home() {
  return (
    <>
      <SceneCanvas />
      <SmoothScroll />
      <ScrollScenes />
      <ScrollFx />
      <Carousels />
      <SiteHeader />
      <main>
        <Intro />
        <Services />
        <Work />
        <Pricing />
        <Estimator />
        <Process />
        <Spotlight />
        <Assistant />
        <Featured />
        <Capabilities />
        <Portal />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
