// middleware.ts (or src/middleware.ts)
import {NextResponse} from "next/server";
import {createI18nMiddleware} from "next-international/middleware";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "./app/locales";

const I18nMiddleware = createI18nMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  urlMappingStrategy: "rewriteDefault",
  resolveLocaleFromRequest: (request) => {
    const pathname = new URL(request.url).pathname;

    // If the URL has an explicit locale prefix, respect it
    // This prevents Accept-Language negotiation from overriding explicit locale URLs
    // (Important for social media crawlers like Twitterbot, Slackbot, etc.)
    for (const locale of SUPPORTED_LOCALES) {
      if (locale !== DEFAULT_LOCALE) {
        if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
          return locale;
        }
      }
    }

    // No explicit locale prefix - return undefined to fall back to default behavior
    // (Accept-Language header negotiation, NEXT_LOCALE cookie, etc.)
    return undefined;
  },
});

// Extensions to skip (static assets, maps, fonts, etc.)
const ASSET_EXT_RE =
  /\.(?:ico|png|jpg|jpeg|svg|gif|webp|avif|css|js|mjs|map|txt|xml|json|woff2?|ttf|otf)$/i;

export function middleware(request) {
  const url = new URL(request.url);
  const {pathname} = url;

  // Always log screenshot hits so failed OG streams can be traced by URL.
  // This runs before the route handler and still logs even if response piping fails later.
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
  return I18nMiddleware(request);
}

export const config = {
  // Keep the matcher simple; don’t try to filter "dots" here.
  matcher: [
    // Everything except Next internals and your API route
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|ads.txt|sitemap).*)",
    // Explicitly include screenshot API routes for request tracing.
    "/api/screenshot/:path*",
  ],
};
