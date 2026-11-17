import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale } from "@/lib/locales";
import { contentFor } from "./locale";

/**
 * This page's content in its language (the [lang] segment, read with
 * next/root-params). Server components only; client components use
 * useContent() (ContentProvider).
 */
export async function getContent() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  return contentFor(locale);
}
