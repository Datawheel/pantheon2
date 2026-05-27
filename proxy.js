import createMiddleware from "next-intl/middleware";
import {NextResponse} from "next/server";
import {routing} from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Extensions to skip (static assets, maps, fonts, etc.)
const ASSET_EXT_RE =
  /\.(?:ico|png|jpg|jpeg|svg|gif|webp|avif|css|js|mjs|map|txt|xml|json|woff2?|ttf|otf)$/i;

// Match the default-locale ("/en" or "/en/...") prefix that should be canonicalised
// to the unprefixed URL with a permanent (301) redirect. next-intl returns 307,
// which Google treats as non-canonical and keeps indexing the prefixed URL.
const DEFAULT_LOCALE_PREFIX_RE = /^\/en(?=\/|$)/;

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

  // Block dev host from being indexed at the response level.
  const host = request.headers.get("host") || "";
  const isDevHost = host.startsWith("dev.pantheon.world");

  if (DEFAULT_LOCALE_PREFIX_RE.test(pathname)) {
    const stripped = pathname.replace(DEFAULT_LOCALE_PREFIX_RE, "") || "/";
    const target = new URL(stripped + url.search, url);
    const redirect = NextResponse.redirect(target, 301);
    // next-intl uses a NEXT_LOCALE cookie to remember the user's preference
    // under localePrefix: "as-needed". Without explicitly updating it here,
    // the unprefixed URL we redirect to would fall back to whatever locale
    // the cookie holds — so visiting /en/foo from a previously-set non-en
    // session would bounce back to the saved locale. Set the cookie to "en"
    // alongside the redirect so the language actually switches.
    redirect.cookies.set("NEXT_LOCALE", "en", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return redirect;
  }

  // Run i18n for everything else (including slugs with dots, e.g. Michael_J._Fox)
  const response = intlMiddleware(request);
  if (isDevHost && response) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: [
    // Everything except Next internals and your API route
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|ads.txt|sitemap).*)",
    // Explicitly include screenshot API routes for request tracing.
    "/api/screenshot/:path*",
  ],
};
