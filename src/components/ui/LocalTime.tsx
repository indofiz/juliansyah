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

/** 1.5 → "1.5", 5 → "5" */
const hours = (h: number) => String(Math.round(Math.abs(h) * 10) / 10);
const fill = (template: string, h: number) => template.replace("{h}", hours(h));

/**
 * Live Jakarta time, how far ahead or behind the visitor is, and how many
 * hours our working days share. Everything depends on the visitor's clock
 * and time zone, so the server renders placeholders and the numbers fill in
 * after load (no hydration mismatch, no layout shift).
 */
export function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const { workday, you } = about;
  let time = "--:--";
  let relation = " ";
  let overlap: number | null = null;

  if (now) {
    time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone }).format(now);
    const mine = offsetMinutes(site.timeZone, now);
    const theirs = offsetMinutes(Intl.DateTimeFormat().resolvedOptions().timeZone, now);
    const diff = (mine - theirs) / 60;
    relation = diff === 0 ? you.same : fill(diff > 0 ? you.ahead : you.behind, diff);
    overlap = overlapHours(mine, theirs, workday.start, workday.end);
  }

  return (
    <div className="lt">
      <p className="lt-now">
        <span className="sr-only">{about.location.localTime}</span>
        <time className="lt-time" dateTime={now?.toISOString()}>
          {time}
        </time>
        <span>
          {about.location.place} · {site.utcOffset}
        </span>
      </p>
      <div className="lt-you">
        <p className="lt-rel">{relation}</p>
        <span className="lt-bar" aria-hidden="true">
          <i style={{ width: `${overlap === null ? 0 : (overlap / (workday.end - workday.start)) * 100}%` }} />
        </span>
        <b>{overlap === null ? "–" : fill(you.overlap, overlap)}</b>
      </div>
    </div>
  );
}
