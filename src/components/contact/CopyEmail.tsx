"use client";

import { useState } from "react";
import { contact, site } from "@/content/site";
import { Icon } from "../ui/Icon";

/** Email address with a copy-to-clipboard button; the result is announced. */
export function CopyEmail() {
  const [status, setStatus] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setStatus(contact.copy.done);
    } catch {
      setStatus(contact.copy.fallback);
    }
    setTimeout(() => setStatus(""), 2500);
  };
  return (
    <div className="contact-email">
      <a href={`mailto:${site.email}`}>{site.email}</a>
      <button type="button" className="btn btn-ghost btn-sm" onClick={copy} aria-label={contact.copy.label}>
        <Icon name={status === contact.copy.done ? "check" : "copy"} size={14} />
      </button>
      <span className="contact-status" role="status">
        {status}
      </span>
    </div>
  );
}
