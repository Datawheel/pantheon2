const GOOGLE_FONT_FAMILIES = {
  ar: "Noto Sans Arabic",
  zh: "Noto Sans SC",
  ja: "Noto Sans JP",
  ru: "Noto Sans",
};

export async function loadLocalizedGoogleFonts(
  locale,
  text,
  name = "LocalizedText",
) {
  const family = GOOGLE_FONT_FAMILIES[locale];
  if (!family || !text) return [];

  const uniqueText = Array.from(new Set(Array.from(text))).join("");
  const cssUrl = new URL("https://fonts.googleapis.com/css2");
  cssUrl.searchParams.set("family", `${family}:wght@400;700`);
  cssUrl.searchParams.set("text", uniqueText);

  try {
    const cssResponse = await fetch(cssUrl, {
      headers: {"user-agent": "Mozilla/5.0"},
      next: {revalidate: 7 * 24 * 60 * 60},
    });
    if (!cssResponse.ok) return [];
    const css = await cssResponse.text();
    const faces = Array.from(css.matchAll(
      /font-style:\s*([^;]+);[\s\S]*?font-weight:\s*(\d+);[\s\S]*?src:\s*url\(([^)]+)\)/g,
    ));

    return (await Promise.all(faces.map(async face => {
      const response = await fetch(face[3], {
        next: {revalidate: 7 * 24 * 60 * 60},
      });
      if (!response.ok) return null;
      return {
        name,
        data: await response.arrayBuffer(),
        weight: parseInt(face[2], 10),
        style: face[1].trim(),
      };
    }))).filter(Boolean);
  } catch {
    return [];
  }
}
