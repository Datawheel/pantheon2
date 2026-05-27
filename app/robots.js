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

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://pantheon.world/sitemap-index.xml",
  };
}
