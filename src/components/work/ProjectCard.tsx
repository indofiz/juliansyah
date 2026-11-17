import { Fragment } from "react";
import type { Project } from "@/content/types";
import { getContent } from "@/content";
import type { LocalContent } from "@/content/locale";
import { localHref, type Locale } from "@/lib/locales";
import { BrowserMedia } from "../media/BrowserMedia";
import { PhoneFrame } from "../media/DeviceFrame";
import { LoopVideo } from "../media/LoopVideo";
import { Icon } from "../ui/Icon";
import { Placeholder } from "../ui/Placeholder";
import { Button } from "../ui/primitives";
import { PhoneScreens } from "../media/DeviceStill";
import { RatingLine } from "./StoreLinks";

type Labels = LocalContent["work"]["labels"];

const href = (p: Project, locale: Locale) => localHref(`/work/${p.slug}`, locale);

/** Role · platform · year, as a small description list. */
function Meta({ p, labels }: { p: Project; labels: Labels }) {
  return (
    <dl className="work-meta">
      <div>
        <dt>{labels.platform}</dt>
        <dd>{p.platforms.join(" · ")}</dd>
      </div>
      <div>
        <dt>{labels.year}</dt>
        <dd>
          <Placeholder text={p.year} />
        </dd>
      </div>
      <div>
        <dt>{labels.role}</dt>
        <dd>
          <Placeholder text={p.role} />
        </dd>
      </div>
    </dl>
  );
}

/** The store rating and the key technologies, in one row under the metric. */
function Extras({ p, labels }: { p: Project; labels: Labels }) {
  if (!p.rating && !p.keyTech?.length) return null;
  return (
    <div className="work-extras">
      {p.rating && <RatingLine rating={p.rating} className="rating-chip" />}
      {p.keyTech && p.keyTech.length > 0 && (
        <p className="work-tech">
          <span className="sr-only">{labels.keyTech}: </span>
          {p.keyTech.map((t, i) => (
            <Fragment key={t}>
              {i > 0 && <span aria-hidden="true"> · </span>}
              <strong>{t}</strong>
            </Fragment>
          ))}
        </p>
      )}
    </div>
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

/**
 * The flagship's phone: the studio phone with the project's real screens
 * when it has them (media.stills + media.screens), else the CSS phone with
 * its loop.
 */
function FlagshipPhone({ p, labels }: { p: Project; labels: Labels }) {
  const { media } = p;
  if (media.stills && media.screens?.length) {
    return (
      <PhoneScreens
        still={media.stills.card}
        screens={media.screens}
        label={`${p.name}: ${labels.screens}`}
        sizes="(max-width: 900px) 185px, 280px"
        screenSizes="(max-width: 900px) 170px, 260px"
        className="flagship-still"
      />
    );
  }
  return (
    <PhoneFrame>
      <LoopVideo media={media} />
    </PhoneFrame>
  );
}

/** Big card: the phone on the left, the story on the right. */
export async function FlagshipCard({ p }: { p: Project }) {
  const { work, locale } = await getContent();
  const { labels } = work;
  return (
    <article className="work-flagship" data-reveal aria-labelledby={`work-${p.slug}`}>
      <span className="work-flagship-glow" aria-hidden="true" />
      <div className="work-flagship-media">
        <FlagshipPhone p={p} labels={labels} />
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
        <Extras p={p} labels={labels} />
        <Meta p={p} labels={labels} />
        <Button href={href(p, locale)} icon="arrowRight">
          {labels.caseStudy}
          <span className="sr-only">: {p.name}</span>
        </Button>
      </div>
    </article>
  );
}

/** Regular card. The title link stretches over the whole card. */
export async function ProjectCard({ p }: { p: Project }) {
  const { work, locale } = await getContent();
  const { labels } = work;
  return (
    <article className="work-card" data-reveal>
      <div className={`work-media work-media--${p.media.frame}`}>
        {p.media.frame === "phone" ? (
          <PhoneFrame>
            <LoopVideo media={p.media} />
          </PhoneFrame>
        ) : (
          <BrowserMedia media={p.media} sizes="(max-width: 640px) 90vw, (max-width: 1023px) 45vw, 370px" scroll="card" />
        )}
      </div>
      <div className="work-body">
        <h3 className="work-title">
          <a href={href(p, locale)} className="work-link">
            <Placeholder text={p.title} />
          </a>
        </h3>
        <MetricLine p={p} />
        <Meta p={p} labels={labels} />
        <span className="work-cta" aria-hidden="true">
          {labels.caseStudy}
          <Icon name="arrowRight" size={14} />
        </span>
      </div>
    </article>
  );
}
