"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { spotlight } from "@/content/site";
import { SpotlightScreen } from "../mocks/Mocks";
import { GlowFrame } from "../ui/primitives";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Sticky case study: the section is tall, its content sticks to the viewport,
 * and scroll progress picks which feature (and which screen) is active.
 */
export function Spotlight() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = spotlight.features.length;

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const i = Math.min(count - 1, Math.floor(self.progress * count));
          setActive((prev) => (prev === i ? prev : i));
        },
      });
    },
    { scope: ref },
  );

  return (
    <section id="spotlight" ref={ref} className="spotlight" style={{ height: `${count * 80 + 40}vh` }}>
      <div className="spot-sticky container">
        <div className="spot-screen">
          <GlowFrame innerClassName="fade-bottom spot-frame-inner">
            {spotlight.features.map((_, i) => (
              <div key={i} className={`spot-layer ${i === active ? "on" : ""}`} aria-hidden={i !== active}>
                <SpotlightScreen index={i} />
              </div>
            ))}
          </GlowFrame>
        </div>
        <div className="spot-copy">
          <h2 className="spot-title grad-text">{spotlight.title}</h2>
          <p className="spot-text">{spotlight.text}</p>
          <ul className="spot-features">
            {spotlight.features.map((f, i) => (
              <li key={f.title} className={i === active ? "on" : ""}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
