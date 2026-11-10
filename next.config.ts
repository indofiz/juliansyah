import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  // The v1 site (git tag `v1-legacy`) had separate pages. Send those URLs to
  // the matching section of the new one-page site so old links keep working.
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/projects", destination: "/#work", permanent: true },
      { source: "/projects/:slug", destination: "/#spotlight", permanent: true },
      { source: "/contact", destination: "/#cta", permanent: true },
    ];
  },
};

export default nextConfig;
