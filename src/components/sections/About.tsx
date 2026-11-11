import Image from "next/image";
import { about } from "@/content/site";
import { Icon } from "../ui/Icon";
import { LocalTime } from "../ui/LocalTime";
import { Placeholder } from "../ui/Placeholder";
import { SectionHeader } from "../ui/primitives";

/**
 * About: the particle portrait (your face with the VR headset) forms in the
 * empty left column (the "about" keyframe in sceneKeyframes), and the real
 * photo sits with the story on the right. On phones the portrait sits above
 * the copy, which gets a frosted panel so it stays readable over the dots.
 */
export function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-portrait-space" aria-hidden="true" />
        <div className="about-copy">
          <SectionHeader id="about-title" align="left" badge={about.badge} badgeIcon="user" title={about.title} />
          <div className="about-intro" data-reveal>
            <figure className="about-photo">
              <Image src={about.photo.src} alt={about.photo.alt} width={about.photo.width} height={about.photo.height} sizes="(max-width: 900px) 6rem, 8.5rem" />
            </figure>
            <div className="about-story">
              {about.story.map((p) => (
                <p key={p}>
                  <Placeholder text={p} />
                </p>
              ))}
            </div>
          </div>
          <div className="about-care" data-reveal>
            <h3>{about.careTitle}</h3>
            <ul>
              {about.care.map((c) => (
                <li key={c}>
                  <Icon name="check" size={16} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="about-where card" data-reveal>
            <h3>{about.location.title}</h3>
            <LocalTime />
          </div>
        </div>
      </div>
    </section>
  );
}
