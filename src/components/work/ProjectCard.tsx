import type { Project } from "@/content/types";
import { work } from "@/content/site";
import { BrowserFrame, PhoneFrame } from "../media/DeviceFrame";
import { LoopVideo } from "../media/LoopVideo";
import { Icon } from "../ui/Icon";
import { Placeholder } from "../ui/Placeholder";
import { Button } from "../ui/primitives";
import { TryDemo } from "./TryDemo";

const href = (p: Project) => `/work/${p.slug}`;

/** Role · platform · year, as a small description list. */
function Meta({ p }: { p: Project }) {
  return (
    <dl className="work-meta">
      <div>
        <dt>{work.labels.platform}</dt>
        <dd>{p.platforms.join(" · ")}</dd>
      </div>
      <div>
        <dt>{work.labels.year}</dt>
        <dd>
          <Placeholder text={p.year} />
        </dd>
      </div>
      <div>
        <dt>{work.labels.role}</dt>
        <dd>
          <Placeholder text={p.role} />
        </dd>
      </div>
    </dl>
  );
}

function MetricLine({ p }: { p: Project }) {
  return (
    <p className="work-metric">
      <strong>
        <Placeholder text={p.metric.value} />
      </strong>
      <span>
        <Placeholder text={p.metric.label} />
      </span>
    </p>
  );
}

/** Big card: "Tap to try" phone on the left, the story on the right. */
export function FlagshipCard({ p }: { p: Project }) {
  return (
    <article className="work-flagship" data-reveal aria-labelledby={`work-${p.slug}`}>
      <span className="work-flagship-glow" aria-hidden="true" />
      <div className="work-flagship-media">
        <TryDemo project={p} />
      </div>
      <div className="work-flagship-body">
        {p.status && <span className="status status-live">{p.status}</span>}
        <h3 id={`work-${p.slug}`} className="work-flagship-title grad-text">
          <Placeholder text={p.title} />
        </h3>
        <p className="work-summary">
          <Placeholder text={p.summary} />
        </p>
        <MetricLine p={p} />
        <Meta p={p} />
        <Button href={href(p)} icon="arrowRight">
          {work.labels.caseStudy}
          <span className="sr-only">: {p.name}</span>
        </Button>
      </div>
    </article>
  );
}

/** Regular card. The title link stretches over the whole card. */
export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="work-card" data-reveal>
      <div className={`work-media work-media--${p.media.frame}`}>
        {p.media.frame === "phone" ? (
          <PhoneFrame>
            <LoopVideo media={p.media} />
          </PhoneFrame>
        ) : (
          <BrowserFrame address={p.media.caption}>
            <LoopVideo media={p.media} />
          </BrowserFrame>
        )}
      </div>
      <div className="work-body">
        <h3 className="work-title">
          <a href={href(p)} className="work-link">
            <Placeholder text={p.title} />
          </a>
        </h3>
        <MetricLine p={p} />
        <Meta p={p} />
        <span className="work-cta" aria-hidden="true">
          {work.labels.caseStudy}
          <Icon name="arrowRight" size={14} />
        </span>
      </div>
    </article>
  );
}
