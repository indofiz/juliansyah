export const isTodo = (s: string) => s.startsWith("TODO:");

/**
 * Renders a string from site.ts. Placeholders ("TODO: …") get a dashed
 * outline so they're obvious on the page until real content replaces them.
 */
export function Placeholder({ text, className = "" }: { text: string; className?: string }) {
  if (!isTodo(text)) return <>{text}</>;
  return (
    <span className={`todo ${className}`} title="Placeholder: replace it in src/content/site.ts">
      {text}
    </span>
  );
}
