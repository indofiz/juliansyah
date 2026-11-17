import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { contentFor } from "@/content/locale";
import { defaultLocale, languageAlternates, localHref } from "@/lib/locales";
import { getProject, nextProject } from "@/lib/projects";
import { caseStudyJsonLd, jsonLdHtml } from "@/lib/jsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { ChatButton } from "@/components/ChatButton";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/sections/Footer";
import { BrowserMedia } from "@/components/media/BrowserMedia";
import { PhoneFrame } from "@/components/media/DeviceFrame";
import Image from "next/image";
import { DeviceStill, PhoneScreens } from "@/components/media/DeviceStill";
import { RatingLine, StoreBadges } from "@/components/work/StoreLinks";
import { ScoreRings } from "@/components/work/ScoreRings";
import { LoopVideo } from "@/components/media/LoopVideo";
import { Icon } from "@/components/ui/Icon";
import { Placeholder, isTodo } from "@/components/ui/Placeholder";

// Every case study is prerendered at build time from site.ts, in every
// language (the [lang] layout lists them); unknown slugs 404.
export function generateStaticParams() {
  return contentFor(defaultLocale).projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { projects, caseStudyLabels, locale } = await getContent();
  const p = getProject(projects, slug);
  if (!p) return {};
  const title = isTodo(p.name) ? caseStudyLabels.ogEyebrow : p.name;
  const path = `/work/${p.slug}`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: localHref(path, locale), languages: languageAlternates(path) },
    openGraph: { type: "article", title, description: p.summary, url: localHref(path, locale) },
    twitter: { card: "summary_large_image", title, description: p.summary },
    // Placeholder projects stay out of search results until they're real.
    robots: p.dummy ? { index: false, follow: true } : undefined,
  };
}

/**
 * Navigations into a case study may wait for the server, on purpose. Next's
 * instant-navigation check wants `params` read inside <Suspense>, but that
 * streams the page before the slug is checked, so an unknown slug would
 * answer 200 (and be indexable) instead of 404; `dynamicParams` can't stop
 * that under Cache Components. Every case study is prerendered, so the wait
 * is one small static file, and the "Next project" link prefetches it.
 */
export const instant = false;

/** Case study: problem → my role → process → key decisions → result → next project. */
export default async function CaseStudyPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { slug } = await params;
  const t = await getContent();
  const { caseStudyLabels: L, projects, work, locale } = t;
  const p = getProject(projects, slug);
  if (!p) notFound();
  const cs = p.caseStudy;
  const next = nextProject(projects, p.slug);

  return (
    <>
      {!p.dummy && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(caseStudyJsonLd(p, t))} />}
      <SmoothScroll />
      <SiteHeader path={`/work/${p.slug}`} />
      <main id="main-content" className="cs">
        <header className="cs-hero">
          <span className="cs-hero-glow" aria-hidden="true" />
          <div className="container cs-hero-grid">
            <div className="cs-hero-copy">
              <Link className="link-quiet cs-back" href={localHref("/#work", locale)}>
                <Icon name="arrowLeft" size={15} />
                {L.back}
              </Link>
              <p className="cs-eyebrow">
                <Placeholder text={p.name} /> <span aria-hidden="true">·</span> <Placeholder text={p.client} />
              </p>
              <h1 className="cs-title grad-text">
                <Placeholder text={p.title} />
              </h1>
              <p className="cs-summary">
                <Placeholder text={p.summary} />
              </p>
              <dl className="cs-facts">
                <div>
                  <dt>{L.role}</dt>
                  <dd>
                    <Placeholder text={p.role} />
                  </dd>
                </div>
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
                  <dt>
                    <Placeholder text={p.metric.label} />
                  </dt>
                  <dd className="cs-facts-metric">
                    <Placeholder text={p.metric.value} />
                  </dd>
                </div>
              </dl>
              {(p.rating || p.stores) && (
                <div className="cs-get">
                  {p.rating && <RatingLine rating={p.rating} />}
                  {p.stores && <StoreBadges stores={p.stores} />}
                </div>
              )}
            </div>
            <figure className={`cs-media cs-media--${p.media.frame}`}>
              {p.media.stills && p.media.screens?.length ? (
                <PhoneScreens
                  still={p.media.stills.page}
                  screens={p.media.screens}
                  label={`${p.name}: ${work.labels.screens}`}
                  sizes="(max-width: 900px) 220px, 290px"
                  screenSizes="(max-width: 900px) 210px, 280px"
                  className="cs-still"
                  eager
                />
              ) : p.media.frame === "phone" ? (
                <PhoneFrame>
                  <LoopVideo media={p.media} />
                </PhoneFrame>
              ) : (
                <BrowserMedia media={p.media} sizes="(max-width: 1440px) 92vw, 1280px" eager scroll="page" />
              )}
            </figure>
          </div>
        </header>

        <div className="container cs-body">
          <section className="cs-block" aria-labelledby="cs-problem">
            <h2 id="cs-problem" className="cs-h2">
              {L.problem}
            </h2>
            <div className="cs-prose">
              {cs.problem.map((t) => (
                <p key={t}>
                  <Placeholder text={t} />
                </p>
              ))}
            </div>
          </section>

          {cs.compare && (
            <section className="cs-block" aria-labelledby="cs-compare">
              <h2 id="cs-compare" className="cs-h2">
                {L.compare}
              </h2>
              <table className="cs-compare">
                <thead>
                  <tr>
                    <th scope="col">{cs.compare.beforeTitle}</th>
                    <th scope="col">{cs.compare.afterTitle}</th>
                  </tr>
                </thead>
                <tbody>
                  {cs.compare.rows.map((r) => (
                    <tr key={r.before}>
                      <td>
                        <Placeholder text={r.before} />
                      </td>
                      <td>
                        <div className="cs-compare-after">
                          <Icon name="check" size={16} />
                          <span>
                            <Placeholder text={r.after} />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <section className="cs-block" aria-labelledby="cs-role">
            <h2 id="cs-role" className="cs-h2">
              {L.role}
            </h2>
            <div className="cs-prose">
              <p>
                <Placeholder text={cs.role.summary} />
              </p>
              <ul className="cs-checks">
                {cs.role.did.map((t) => (
                  <li key={t}>
                    <Icon name="check" size={16} />
                    <span>
                      <Placeholder text={t} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="cs-block" aria-labelledby="cs-process">
            <h2 id="cs-process" className="cs-h2">
              {L.process}
            </h2>
            <ol className="cs-steps">
              {cs.process.map((s, i) => (
                <li key={s.title + i}>
                  <span className="cs-step-n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>
                    <Placeholder text={s.title} />
                  </h3>
                  <p>
                    <Placeholder text={s.text} />
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {cs.stack && cs.stack.length > 0 && (
            <section className="cs-block" aria-labelledby="cs-stack">
              <h2 id="cs-stack" className="cs-h2">
                {L.stack}
              </h2>
              <div className="cs-stack">
                {cs.stack.map((g) => (
                  <div key={g.group} className="cs-stack-group">
                    <h3>{g.group}</h3>
                    <ul className="tags">
                      {g.items.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="cs-block" aria-labelledby="cs-decisions">
            <h2 id="cs-decisions" className="cs-h2">
              {L.decisions}
            </h2>
            <div className="cs-decisions">
              {cs.decisions.map((d) => (
                <article key={d.title} className="card cs-decision">
                  <h3>
                    <Placeholder text={d.title} />
                  </h3>
                  <p>
                    <Placeholder text={d.why} />
                  </p>
                  {d.tradeoff && (
                    <p className="cs-tradeoff">
                      <b>{L.tradeoff}: </b>
                      <Placeholder text={d.tradeoff} />
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          {(cs.gallery?.length || cs.tablet) && p.media.stills && (
            <section className="cs-block" aria-labelledby="cs-screens">
              <h2 id="cs-screens" className="cs-h2">
                {L.screens}
              </h2>
              <div className="cs-screens">
                {cs.tablet && p.media.stills.tablet && p.media.screens?.[0] && (
                  <figure className="cs-devices">
                    {/* The tablet, and the phone's first screen in front of it. */}
                    <div className="cs-devices-pair">
                      <DeviceStill still={p.media.stills.tablet} sizes="(max-width: 900px) 80vw, 450px" className="cs-tablet">
                        <Image className="device-shot" src={cs.tablet.src} alt={cs.tablet.alt} fill sizes="(max-width: 900px) 76vw, 420px" />
                      </DeviceStill>
                      <DeviceStill still={p.media.stills.page} sizes="(max-width: 900px) 28vw, 160px" className="cs-pair-phone">
                        <Image className="device-shot" src={p.media.screens[0].src} alt={p.media.screens[0].alt} fill sizes="(max-width: 900px) 26vw, 150px" />
                      </DeviceStill>
                    </div>
                    <figcaption>{cs.tablet.caption}</figcaption>
                  </figure>
                )}
                {cs.gallery && cs.gallery.length > 0 && (
                  <ul className="cs-gallery">
                    {cs.gallery.map((s) => (
                      <li key={s.src}>
                        <figure>
                          <DeviceStill still={p.media.stills!.page} sizes="(max-width: 900px) 170px, 200px" className="cs-shot">
                            <Image className="device-shot" src={s.src} alt={s.alt} fill sizes="(max-width: 900px) 160px, 190px" />
                          </DeviceStill>
                          <figcaption>{s.caption}</figcaption>
                        </figure>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          <section className="cs-block" aria-labelledby="cs-result">
            <h2 id="cs-result" className="cs-h2">
              {L.result}
            </h2>
            <div className="cs-prose">
              {p.lighthouse && <ScoreRings scores={p.lighthouse} labels={work.labels.lighthouse} size="lg" />}
              {cs.result.metrics.length > 0 && (
                <ul className="cs-metrics">
                  {cs.result.metrics.map((m) => (
                    <li key={m.label}>
                      <strong>
                        <Placeholder text={m.value} />
                      </strong>
                      <span>
                        <Placeholder text={m.label} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p>
                <Placeholder text={cs.result.text} />
              </p>
              {cs.links && cs.links.length > 0 && (
                <ul className="cs-links" aria-label={L.links}>
                  {cs.links.map((l) => (
                    <li key={l.label}>
                      {isTodo(l.href) ? (
                        <span className="cs-link-todo">
                          {l.label}: <Placeholder text={l.href} />
                        </span>
                      ) : (
                        <a className="btn btn-ghost btn-sm" href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label}
                          <Icon name="arrowUpRight" size={14} />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <nav className="cs-next" aria-label={L.next}>
            {/* prefetch: the next case study (static) is loaded before the click. */}
            <Link href={localHref(`/work/${next.slug}`, locale)} className="cs-next-link" prefetch>
              <span className="cs-next-label">{L.next}</span>
              <span className="cs-next-title">
                <Placeholder text={next.title} />
              </span>
              <Icon name="arrowRight" size={22} />
            </Link>
          </nav>
        </div>
      </main>
      <Footer />
      <ChatButton />
    </>
  );
}
