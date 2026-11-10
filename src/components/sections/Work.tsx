import { work } from "@/content/site";
import { Icon } from "../ui/Icon";
import { SectionHeader } from "../ui/primitives";

/** Project index as a glowing table; rows light up as they scroll in. */
export function Work() {
  return (
    <section id="work" className="section work">
      <div className="container">
        <SectionHeader badge={work.badge} badgeIcon="star" title={work.title} text={work.text} />
        <div className="table-glow" data-reveal>
          <div className="table" role="table" aria-label="Selected projects">
            <div className="table-row table-head" role="row">
              <span role="columnheader">Project</span>
              <span role="columnheader">Year</span>
              <span role="columnheader">Result</span>
              <span role="columnheader">Status</span>
              <span role="columnheader" className="right">
                Type
              </span>
            </div>
            {work.rows.map((r) => (
              <a href="#spotlight" className="table-row" role="row" key={r.name} data-light>
                <span className="table-project" role="cell">
                  <span className="table-avatar" style={{ background: r.color }}>
                    {r.initials}
                  </span>
                  <span>
                    <b>{r.name}</b>
                    <small>{r.client}</small>
                  </span>
                </span>
                <span role="cell">{r.year}</span>
                <span role="cell">{r.metric}</span>
                <span role="cell">
                  <span className="status">Live</span>
                </span>
                <span role="cell" className="right table-cat">
                  {r.category} <Icon name="chevronRight" size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>
        <p className="table-note" data-reveal>
          {work.note}
        </p>
      </div>
    </section>
  );
}
