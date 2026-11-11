/**
 * A tiny Dart highlighter that runs at build time (only server components
 * call it, and the page is prerendered), so no highlighter ships to the
 * browser. It covers what a short Flutter snippet needs: comments, strings,
 * annotations, numbers, keywords, types, calls and properties.
 */

export type TokenKind = "comment" | "string" | "annotation" | "number" | "keyword" | "type" | "call" | "prop" | "punct" | "plain";
export type Token = { text: string; kind: TokenKind };

const KEYWORDS = new Set([
  "abstract", "async", "await", "bool", "break", "case", "class", "const", "continue", "default", "double",
  "else", "enum", "extends", "false", "final", "for", "if", "import", "in", "int", "is", "late", "mixin",
  "new", "null", "on", "override", "required", "return", "static", "super", "switch", "this", "true",
  "var", "void", "while", "with", "yield",
]);

const TOKEN = /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|(@\w+)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_\d])/g;

/** Splits Dart source into lines of classified tokens. */
export function highlightDart(source: string): Token[][] {
  return source.split("\n").map((line) => {
    const out: Token[] = [];
    let prev = "";
    for (const m of line.matchAll(TOKEN)) {
      const [text, comment, str, annotation, num, ident, space] = m;
      let kind: TokenKind = "punct";
      if (comment) kind = "comment";
      else if (str) kind = "string";
      else if (annotation) kind = "annotation";
      else if (num) kind = "number";
      else if (space) kind = "plain";
      else if (ident) {
        const rest = line.slice((m.index ?? 0) + text.length);
        if (KEYWORDS.has(ident)) kind = "keyword";
        else if (/^[A-Z]/.test(ident)) kind = "type";
        else if (/^\s*\(/.test(rest)) kind = "call";
        else if (prev === ".") kind = "prop";
        else kind = "plain";
      }
      out.push({ text, kind });
      if (!space) prev = text;
    }
    return out;
  });
}
