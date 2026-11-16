"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ClientContent } from "@/content/locale";

const Ctx = createContext<ClientContent | null>(null);

/** Gives client components their strings in the page's language (set in the [lang] layout). */
export function ContentProvider({ value, children }: { value: ClientContent; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent(): ClientContent {
  const value = useContext(Ctx);
  if (!value) throw new Error("useContent() needs a <ContentProvider> above it");
  return value;
}
