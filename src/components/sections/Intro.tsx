import { Hero } from "./Hero";
import { Proof } from "./Proof";

/**
 * Hero + proof as one pinned scene.
 *
 * The wrapper is three screens tall and its stage sticks to the viewport, so
 * scrolling drives the animation instead of moving the page (see the intro
 * timeline in ScrollFx and the "proof" keyframe in sceneKeyframes):
 *   1st screen of scroll: headline slides up, work reel slides down,
 *                         globe rises from the bottom to the centre
 *   2nd screen:           proof copy and rows fade in around the globe
 *   then:                 the stage releases and the page scrolls on
 *
 * With reduced motion nothing pins: hero and proof stack as normal sections
 * (see reduced-motion.css).
 */
export function Intro() {
  return (
    <div id="hero" className="intro">
      <div className="intro-stage">
        <Hero />
        <Proof />
      </div>
    </div>
  );
}
