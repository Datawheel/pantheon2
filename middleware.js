// middleware.ts (or src/middleware.ts)
import {NextResponse} from "next/server";
import {createI18nMiddleware} from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en"],
  defaultLocale: "en",
  urlMappingStrategy: "rewriteDefault",
});

// Extensions to skip (static assets, maps, fonts, etc.)
const ASSET_EXT_RE =
  /\.(?:ico|png|jpg|jpeg|svg|gif|webp|avif|css|js|mjs|map|txt|xml|json|woff2?|ttf|otf)$/i;

export function middleware(request) {
  const url = new URL(request.url);
  const {pathname} = url;

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
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|ads.txt).*)",
  ],
};
