"use client";

import { useEffect, useRef, useState } from "react";
import type { PlaygroundItem } from "@/content/types";
import { playground } from "@/content/site";
import { LoopVideo, MediaPlaceholder } from "../media/LoopVideo";
import { Icon } from "../ui/Icon";
import { Placeholder, isTodo } from "../ui/Placeholder";

/**
 * One experiment. Nothing loads until the tile is near the viewport:
 *  - video: LoopVideo (preload="none", plays near the viewport, pauses off screen)
 *  - iframe: mounted when near, unmounted when it scrolls well away, so an
 *    off-screen experiment never keeps running. With reduced motion it
 *    waits for a click on "Load experiment".
 */
export function PlaygroundTile({ item }: { item: PlaygroundItem }) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [requested, setRequested] = useState(false);
  const isFrame = item.kind === "iframe" && Boolean(item.src);

  useEffect(() => {
    if (!isFrame) return;
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    const onChange = () => setReduce(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", onChange);
    };
  }, [isFrame]);

  const showFrame = isFrame && near && (!reduce || requested);

  return (
    <article ref={ref} className="pg-tile" data-reveal data-slide>
      <div className="pg-media">
        {isFrame ? (
          showFrame ? (
            <iframe className="pg-frame" src={item.src} title={item.title} loading="lazy" />
          ) : (
            <>
              <MediaPlaceholder media={item.media} />
              {reduce && (
                <button type="button" className="btn btn-ghost btn-sm pg-load" onClick={() => setRequested(true)}>
                  <Icon name="play" size={14} />
                  {playground.labels.load}
                </button>
              )}
            </>
          )
        ) : (
          <LoopVideo media={item.media} />
        )}
      </div>
      <div className="pg-body">
        <h3 className="pg-title">
          <Placeholder text={item.title} />
        </h3>
        <p className="pg-text">
          <Placeholder text={item.text} />
        </p>
        <div className="pg-foot">
          <ul className="bento-tags">
            {item.tags.map((t) => (
              <li key={t}>
                <Placeholder text={t} />
              </li>
            ))}
          </ul>
          {item.href && !isTodo(item.href) && (
            <a className="link-quiet pg-link" href={item.href} target="_blank" rel="noopener noreferrer">
              {playground.labels.source}
              <Icon name="arrowUpRight" size={14} />
              <span className="sr-only">: {item.title}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
