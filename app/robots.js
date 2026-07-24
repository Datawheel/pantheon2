import {headers} from "next/headers";

export const dynamic = "force-dynamic";

export default async function robots() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Block all crawling on the dev host so it never lands in the index.
  if (host.startsWith("dev.")) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // High-volume AI/SEO crawlers that drove the 2026-07-24 disk-I/O outage
  // (bots were ~50% of traffic; Bytespider alone ~1.36M req/day). They provide
  // no search-engine value, so block them outright. Real search engines
  // (Googlebot, bingbot, etc.) stay allowed via the "*" rule below.
  const blockedCrawlers = [
    "Bytespider",
    "Amazonbot",
    "ClaudeBot",
    "GPTBot",
    "meta-externalagent",
    "AhrefsBot",
    "SemrushBot",
    "PerplexityBot",
  ];

  return {
    rules: [
      ...blockedCrawlers.map((userAgent) => ({userAgent, disallow: "/"})),
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://pantheon.world/sitemap-index.xml",
  };
}
