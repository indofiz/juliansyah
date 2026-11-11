"use client";

import { useState } from "react";
import { assistant } from "@/content/site";
import { Icon } from "../ui/Icon";
import { Sparkline, series } from "../ui/Sparkline";

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button className="toggle" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} />;
}

/** Client portal mock with working toggles. */
export function PortalMock() {
  const [isPublic, setPublic] = useState(true);
  const [settings, setSettings] = useState({ "Show project name": true, "Show progress": true, "Show budget": false, "Show team": true });

  return (
    <div className="portal-mock">
      <div>
        <div className="portal-title">Share Preview</div>
        <div className="mock-sub" style={{ fontSize: "0.8125rem" }}>
          Create a private link so your team can follow the build in real time.
        </div>
      </div>
      <div className="portal-row">
        <div className="mock-panel portal-toggle-card">
          <div>
            <b>Enable live preview</b>
            <small>Anyone with the link can view the latest build</small>
          </div>
          <Toggle on={isPublic} onChange={setPublic} label="Enable live preview" />
        </div>
        <div className="mock-panel portal-stat">
          <b>{isPublic ? 37 : 0}</b>
          <small>Views this week</small>
        </div>
        <div className="mock-panel portal-stat">
          <b>{isPublic ? 12 : 0}</b>
          <small>Builds / week</small>
        </div>
        <div className="mock-panel" style={{ padding: "0.875rem 1rem" }}>
          <div className="mock-sub" style={{ marginTop: 0, display: "flex", justifyContent: "space-between" }}>
            <span>Progress</span>
            <span>NOVEMBER</span>
          </div>
          <Sparkline values={series(44, 30, 1, 0.4)} height={70} />
        </div>
      </div>
      <div className="portal-label">Share Link</div>
      <div className="portal-link" style={{ opacity: isPublic ? 1 : 0.4 }}>
        <div className="portal-input">https://preview.yourname.dev/orbit-2026</div>
        <span className="portal-icon">
          <Icon name="copy" size={16} />
        </span>
        <span className="portal-icon">
          <Icon name="link" size={16} />
        </span>
        <span className="portal-icon">
          <Icon name="eye" size={16} />
        </span>
      </div>
      <div className="portal-label">Privacy Settings</div>
      <div className="portal-settings">
        {Object.entries(settings).map(([label, on]) => (
          <div className="portal-setting" key={label}>
            {label}
            <Toggle on={on} label={label} onChange={(v) => setSettings((s) => ({ ...s, [label]: v }))} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Assistant chat mock: suggestion chips reveal canned answers. Wire to a real API later. */
export function ChatMock() {
  const [thread, setThread] = useState<{ q: string; a: string }[]>([]);
  const [active, setActive] = useState("Chats");

  return (
    <div className="chat">
      <aside className="chat-side">
        <div className="chat-head">
          <Icon name="message" size={16} /> Assistant <span className="chat-ver">v1.0</span>
        </div>
        <button className="chat-new" onClick={() => setThread([])}>
          <Icon name="plus" size={15} /> New chat
        </button>
        <div className="chat-search">
          <Icon name="search" size={13} /> Search chats…
        </div>
        <div className="chat-tabs">
          {["Chats", "Projects", "Stack"].map((t) => (
            <span key={t} className={t === active ? "on" : ""} onClick={() => setActive(t)} role="button" tabIndex={0}>
              {t}
            </span>
          ))}
        </div>
        {(thread.length ? thread : [{ q: "Can you design and build it?", a: "" }]).map((t) => (
          <div className="chat-hist" key={t.q}>
            <Icon name="message" size={12} /> {t.q}
          </div>
        ))}
      </aside>
      <div className="chat-main">
        <div className="chat-glow" />
        <div className="chat-bar">
          <span className="chat-credits">
            <Icon name="zap" size={12} /> 47
          </span>
          <Icon name="layers" size={15} />
          <Icon name="eye" size={15} />
        </div>
        {thread.length === 0 ? (
          <div className="chat-empty">
            <span className="chat-empty-icon">
              <Icon name="message" size={22} />
            </span>
            <b>Ask me anything about my work</b>
            <small>Pick a question to see my answer.</small>
            <div className="chat-suggest">
              {assistant.suggestions.map((s) => (
                <button key={s.q} onClick={() => setThread([s])}>
                  {s.q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-thread">
            {thread.map((t) => (
              <div key={t.q} style={{ display: "contents" }}>
                <div className="bubble me">{t.q}</div>
                <div className="bubble ai">{t.a}</div>
              </div>
            ))}
            <div className="chat-suggest" style={{ justifyContent: "flex-start" }}>
              {assistant.suggestions
                .filter((s) => !thread.some((t) => t.q === s.q))
                .map((s) => (
                  <button key={s.q} onClick={() => setThread((th) => [...th, s])}>
                    {s.q}
                  </button>
                ))}
            </div>
          </div>
        )}
        <div className="chat-input">
          Ask about projects, pricing or availability…
          <span>
            <Icon name="arrowRight" size={15} />
          </span>
        </div>
      </div>
    </div>
  );
}
