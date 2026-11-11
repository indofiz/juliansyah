import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build date for the footer's "Last updated" (inlined, so the page stays static).
  env: { NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10) },
  cacheComponents: true,
  partialPrefetching: true,

  // The v1 site (git tag `v1-legacy`) had separate pages. Send those URLs to
  // the matching section or case study so old links keep working.
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/projects", destination: "/#work", permanent: true },
      { source: "/projects/:slug", destination: "/work/:slug", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
