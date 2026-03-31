export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://pantheon.world/sitemap-index.xml",
  };
}
