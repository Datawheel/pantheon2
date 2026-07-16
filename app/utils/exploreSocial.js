import {SUPPORTED_LOCALES} from "@/app/locales";
import {buildCanonical, SITE_URL} from "@/app/utils/hreflang";

const OPEN_GRAPH_LOCALES = {
  ar: "ar_AR",
  zh: "zh_CN",
  nl: "nl_NL",
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
  hu: "hu_HU",
  it: "it_IT",
  ja: "ja_JP",
  pl: "pl_PL",
  pt: "pt_PT",
  ru: "ru_RU",
  es: "es_ES",
};

function truncate(value, maxLength) {
  const normalized = `${value || ""}`.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function getOpenGraphLocale(locale) {
  return OPEN_GRAPH_LOCALES[locale] || OPEN_GRAPH_LOCALES.en;
}

export function buildExploreOgImageUrl({
  locale,
  kind,
  title,
  subtitle,
}) {
  const imageUrl = new URL("/api/screenshot/explore", SITE_URL);
  imageUrl.searchParams.set("locale", locale);
  imageUrl.searchParams.set("kind", kind === "rankings" ? "rankings" : "viz");
  imageUrl.searchParams.set("title", truncate(title, 160));
  imageUrl.searchParams.set("subtitle", truncate(subtitle, 260));
  return imageUrl.toString();
}

export function buildExploreSocialMetadata({
  locale,
  kind,
  title,
  description,
  imageTitle = title,
  imageDescription = description,
  canonicalPath,
}) {
  const canonicalUrl = buildCanonical(locale, canonicalPath);
  const imageUrl = buildExploreOgImageUrl({
    locale,
    kind,
    title: imageTitle,
    subtitle: imageDescription,
  });
  const imageAlt = truncate(imageTitle, 200);
  const image = {
    url: imageUrl,
    width: 1200,
    height: 630,
    type: "image/png",
    alt: imageAlt,
  };

  return {
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "Pantheon",
      locale: getOpenGraphLocale(locale),
      alternateLocale: SUPPORTED_LOCALES
        .filter(currentLocale => currentLocale !== locale)
        .map(getOpenGraphLocale),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{url: imageUrl, alt: imageAlt}],
    },
  };
}
