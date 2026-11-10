"use client";

import { useState } from "react";
import { estimator } from "@/content/site";
import { Badge, Button } from "../ui/primitives";
import { Icon } from "../ui/Icon";

/** Scope selector on the left updates the stat boxes on the right. */
export function Estimator() {
  const [selected, setSelected] = useState(2);
  const tier = estimator.tiers[selected];

  return (
    <section id="estimator" className="section estimator">
      <div className="container">
        <div className="est-panel" data-reveal>
          <div className="est-glow" />
          <div className="dots est-dots" />
          <div className="est-left">
            <h3 className="est-heading">{estimator.heading}</h3>
            <div className="tiers" role="radiogroup" aria-label={estimator.heading}>
              {estimator.tiers.map((t, i) => (
                <button
                  key={t.tier}
                  role="radio"
                  aria-checked={i === selected}
                  className={`tier-row ${i === selected ? "on" : ""} ${i === estimator.tiers.length - 1 ? "last" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  <span className="tier-pill">{t.tier}</span>
                  <span className="tier-name">
                    {t.name} <em>{t.base}</em>
                  </span>
                  <span className="tier-plus">{t.plus}</span>
                  <span className="tier-total">{t.total}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="est-right">
            <div className="est-title-row">
              <h3 className="est-title grad-text">{estimator.title}</h3>
              <Badge icon="flame" variant="plain">
                {estimator.badge}
              </Badge>
            </div>
            <p className="est-text">{estimator.text}</p>
            <div className="est-stats" aria-live="polite">
              {tier.stats.map((v, i) => (
                <div className="est-stat" key={estimator.statLabels[i]}>
                  <b>{v}</b>
                  <small>{estimator.statLabels[i]}</small>
                </div>
              ))}
            </div>
            <a href="#cta" className="btn btn-glow btn-lg btn-block est-cta">
              <Icon name="trophy" size={17} />
              {estimator.cta}
            </a>
            <div className="btn-row">
              <Button variant="light" href="#cta">
                Get started
              </Button>
              <Button variant="ghost" href="#process">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
