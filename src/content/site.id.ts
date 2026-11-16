/**
 * Bahasa Indonesia, as English line → Indonesian line. content/locale.ts
 * swaps every string in site.ts that has an entry here; links, images,
 * numbers and names come from site.ts, so the two versions can't disagree.
 *
 * - The key must match the English in site.ts exactly. When you change an
 *   English line, change its key here too: `npm run i18n:check` lists every
 *   English line with no entry (and entries no line uses any more).
 * - A line that stays the same in Indonesian (a name, a tool) maps to itself.
 * - "TODO:" placeholders are left out: they stay English until they're real.
 * - **Bold** markers and {reply} slots must stay in the translation.
 */
export const id: Record<string, string> = {};
