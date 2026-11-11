import { assistant } from "@/content/site";
import { ChatMock } from "../mocks/InteractiveMocks";
import { Badge, GlowFrame } from "../ui/primitives";

/** The one purple section: glossy orb, purple badge, framed chat UI. */
export function Assistant() {
  return (
    <section id="assistant" className="section assistant">
      <div className="assistant-ambient" aria-hidden="true" />
      <div className="container assistant-inner">
        <div className="orb" aria-hidden="true">
          <span className="orb-swirl" />
        </div>
        <header className="sh" data-reveal>
          <Badge icon="message" variant="purple">
            {assistant.badge}
          </Badge>
          <h2 className="h2 grad-text">{assistant.title}</h2>
          <p className="sh-text">
            {assistant.text[0]}
            <br />
            {assistant.text[1]}
          </p>
        </header>
        <div className="assistant-frame" data-reveal>
          <GlowFrame purple>
            <ChatMock />
          </GlowFrame>
        </div>
      </div>
    </section>
  );
}
