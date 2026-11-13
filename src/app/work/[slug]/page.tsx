import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudyLabels as L, projects, work } from "@/content/site";
import { getProject, nextProject } from "@/lib/projects";
import { caseStudyJsonLd, jsonLdHtml } from "@/lib/jsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/sections/Footer";
import { BrowserFrame, PhoneFrame } from "@/components/media/DeviceFrame";
import { PhoneScreens } from "@/components/media/DeviceStill";
import { LoopVideo } from "@/components/media/LoopVideo";
import { Icon } from "@/components/ui/Icon";
import { Placeholder, isTodo } from "@/components/ui/Placeholder";

// Every case study is prerendered at build time from site.ts; unknown slugs 404.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = isTodo(p.name) ? "Case study" : p.name;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { type: "article", title, description: p.summary, url: `/work/${p.slug}` },
    twitter: { card: "summary_large_image", title, description: p.summary },
    // Placeholder projects stay out of search results until they're real.
    robots: p.dummy ? { index: false, follow: true } : undefined,
  };
}

/** Case study: problem → my role → process → key decisions → result → next project. */
export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const cs = p.caseStudy;
  const next = nextProject(p.slug);

  return (
    <>
      {!p.dummy && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(caseStudyJsonLd(p))} />}
      <SmoothScroll />
      <SiteHeader />
      <main id="main-content" className="cs">
        <header className="cs-hero">
          <span className="cs-hero-glow" aria-hidden="true" />
          <div className="container cs-hero-grid">
            <div className="cs-hero-copy">
              <Link className="link-quiet cs-back" href="/#work">
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
                />
              ) : p.media.frame === "phone" ? (
                <PhoneFrame>
                  <LoopVideo media={p.media} />
                </PhoneFrame>
              ) : (
                <BrowserFrame address={p.media.caption}>
                  <LoopVideo media={p.media} />
                </BrowserFrame>
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

          <section className="cs-block" aria-labelledby="cs-result">
            <h2 id="cs-result" className="cs-h2">
              {L.result}
            </h2>
            <div className="cs-prose">
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
            <Link href={`/work/${next.slug}`} className="cs-next-link">
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
    </>
  );
}
