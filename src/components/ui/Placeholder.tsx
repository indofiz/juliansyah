import { Fragment } from "react";

export const isTodo = (s: string) => s.startsWith("TODO:");

/** Strips the **bold** markers, for places that need plain text (alt, meta). */
export const plainText = (s: string) => s.replaceAll("**", "");

/**
 * Renders a string from site.ts. Placeholders ("TODO: …") get a dashed
 * outline so they're obvious on the page until real content replaces them.
 * Words wrapped in **double asterisks** are shown in bold.
 */
export function Placeholder({ text, className = "" }: { text: string; className?: string }) {
  if (isTodo(text)) {
    return (
      <span className={`todo ${className}`} title="Placeholder: replace it in src/content/site.ts">
        {text}
      </span>
    );
  }
  if (!text.includes("**")) return <>{text}</>;
  // "a **b** c" splits into ["a ", "b", " c"]: every odd part is bold.
  return (
    <>
      {text.split("**").map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}
