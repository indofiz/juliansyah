import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Studio } from "@/components/studio/Studio";

const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  // No title in production, so the 404 there doesn't name the tool.
  ...(isProduction ? {} : { title: "Phone studio" }),
  robots: { index: false, follow: false },
};

/**
 * Dev-only tool for rendering device mockups (docs/plans/phone-3d-mockup.md).
 * Production builds answer with a 404, so it never reaches visitors.
 */
export default function StudioPage() {
  if (isProduction) notFound();
  return <Studio />;
}
