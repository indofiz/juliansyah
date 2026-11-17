import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie } from "@/lib/locales";

/**
 * Language routing. Every page lives under app/[lang]; English keeps the
 * plain URLs.
 *
 *  - /id/...      Indonesian, served as it is
 *  - /en/...      redirected to the same page without /en (one URL per page)
 *  - anything else is English: rewritten to /en/... (the address bar keeps
 *    the plain URL), unless the visitor picked another language before
 *    (cookie), who is sent to that version instead
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === defaultLocale) {
    // Next's own links to metadata images (/en/opengraph-image) stay as they are.
    if (pathname.includes("/opengraph-image")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) return NextResponse.next();

  const saved = request.cookies.get(localeCookie)?.value;
  const url = request.nextUrl.clone();
  if (isLocale(saved) && saved !== defaultLocale) {
    url.pathname = `/${saved}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 307);
  }
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next's own files and anything with an extension: images, models,
  // fonts, APKs, favicon.ico, sitemap.xml, robots.txt.
  matcher: ["/((?!_next/|.*\\.[^/]+$).*)"],
};
