"use client";

import { useEffect, useState } from "react";
import { about, site } from "@/content/site";

/** Minutes a time zone is ahead of UTC at a given instant (DST-aware). */
function offsetMinutes(tz: string, at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(at);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return Math.round((asUtc - at.getTime()) / 60000);
}

/** Hours two 09:00–18:00 working days overlap, given each zone's UTC offset. */
function overlapHours(mine: number, theirs: number, start: number, end: number) {
  let best = 0;
  for (const shift of [-1440, 0, 1440]) {
    const a0 = start * 60 - mine;
    const a1 = end * 60 - mine;
    const b0 = start * 60 - theirs + shift;
    const b1 = end * 60 - theirs + shift;
    best = Math.max(best, Math.min(a1, b1) - Math.max(a0, b0));
  }
  return Math.round(best / 30) / 2;
}

/**
 * Live Jakarta time and the overlap with each listed city. Computed in the
 * browser (it depends on today's date and daylight saving), so the server
 * renders the city names and the numbers fill in after load.
 */
export function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone }).format(now)
    : "--:--";
  const mine = now ? offsetMinutes(site.timeZone, now) : 0;

  return (
    <div className="lt">
      <p className="lt-now">
        <span>{about.location.localTime}</span>
        <time className="lt-time" dateTime={now?.toISOString()}>
          {time}
        </time>
        <span className="lt-zone">
          {about.location.place} · {site.utcOffset}
        </span>
      </p>
      <h3 className="lt-title">{about.overlapTitle}</h3>
      <ul className="lt-list">
        {about.zones.map((z) => {
          const h = now ? overlapHours(mine, offsetMinutes(z.tz, now), about.workday.start, about.workday.end) : null;
          return (
            <li key={z.tz}>
              <span>{z.city}</span>
              <span className="lt-bar" aria-hidden="true">
                <i style={{ width: `${h === null ? 0 : (h / (about.workday.end - about.workday.start)) * 100}%` }} />
              </span>
              <b>
                {h === null ? "–" : h} {about.overlapUnit}
              </b>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
