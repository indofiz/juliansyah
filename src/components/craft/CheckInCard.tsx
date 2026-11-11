"use client";

import { useState } from "react";
import { designToCode, site } from "@/content/site";
import { Icon } from "../ui/Icon";

const c = designToCode.card;

/**
 * The check-in card as HTML: the "Design" stage shows it still, the
 * "Running" stage makes it work (tap Check in, see the time it recorded).
 * Everything inside is sized in cqw, so it scales with its stage.
 */
export function CheckInCard({ interactive = false }: { interactive?: boolean }) {
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  const checkIn = () =>
    setCheckedAt(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone }).format(new Date()));

  return (
    <div className={`ci-card ${checkedAt ? "is-done" : ""}`}>
      <div className="ci-head">
        <span className="ci-greeting">{c.greeting}</span>
        <span className="ci-time">{checkedAt ?? c.time}</span>
      </div>
      <div className="ci-office">
        <small>{c.officeLabel}</small>
        <b>{c.office}</b>
      </div>
      <div className="ci-map" aria-hidden="true">
        <span className="ci-fence" />
        <span className="ci-pin" />
      </div>
      <p className="ci-status" aria-live={interactive ? "polite" : undefined}>
        <span className="ci-dot" />
        {checkedAt ? c.statusDone : c.status}
      </p>
      {interactive ? (
        checkedAt ? (
          <div className="ci-done">
            <span className="ci-btn ci-btn--done">
              <Icon name="check" size={14} />
              {c.buttonDone} {checkedAt}
            </span>
            <button type="button" className="ci-reset" onClick={() => setCheckedAt(null)}>
              {c.reset}
            </button>
          </div>
        ) : (
          <button type="button" className="ci-btn" onClick={checkIn}>
            {c.button}
          </button>
        )
      ) : (
        <span className="ci-btn">{c.button}</span>
      )}
    </div>
  );
}
