import createMiddleware from "next-intl/middleware";
import {NextResponse} from "next/server";
import {routing} from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Extensions to skip (static assets, maps, fonts, etc.)
const ASSET_EXT_RE =
  /\.(?:ico|png|jpg|jpeg|svg|gif|webp|avif|css|js|mjs|map|txt|xml|json|woff2?|ttf|otf)$/i;

export function proxy(request) {
  const url = new URL(request.url);
  const {pathname} = url;

  // Always log screenshot hits so failed OG streams can be traced by URL.
  if (pathname.startsWith("/api/screenshot/")) {
    console.log(
      "[screenshot-hit]",
      `${pathname}${url.search}`,
      request.headers.get("user-agent") || "unknown-ua"
    );
    return NextResponse.next();
  }

  // Skip middleware for actual assets (only when the URL truly ends in an extension)
  if (ASSET_EXT_RE.test(pathname)) {
    return NextResponse.next();
  }

  // Run i18n for everything else (including slugs with dots, e.g. Michael_J._Fox)
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Everything except Next internals and your API route
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|ads.txt|sitemap).*)",
    // Explicitly include screenshot API routes for request tracing.
    "/api/screenshot/:path*",
  ],
};
