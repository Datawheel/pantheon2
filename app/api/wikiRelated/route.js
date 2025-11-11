const axios = require("axios");

export async function GET(request) {
  const {searchParams} = new URL(request.url);

  const wikiSlug = searchParams.get("slug");
  if (!wikiSlug) return Response.json([]);

  const wikiRelatedURL = `https://en.wikipedia.org/api/rest_v1/page/related/${encodeURIComponent(
    wikiSlug
  )}`;
  const topRelatedResp = await axios
    .get(wikiRelatedURL, {
      headers: {
        'User-Agent': 'Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)'
      }
    })
    .catch(
      e => (
        console.log(`Wiki Related API Error: No page for ${wikiSlug} found.`),
        {data: []}
      )
    );
  const topRelatedJson = topRelatedResp.data;

  if (!topRelatedJson.pages || !topRelatedJson.pages.length)
    return Response.json([]);

  const pantheonPersonQuery = topRelatedJson.pages.map(
    d => `id.eq.${d.pageid}`
  );
  const topRelatedInPantheonResp = await axios
    .get(
      `https://api.pantheon.world/person?or=(${pantheonPersonQuery})&select=id,birthyear,name,hpi,slug,occupation.occupation_name`
    )
    .catch(
      e => (
        console.log(`Pantheon Related Error: No bios for ${wikiSlug} found.`),
        {data: []}
      )
    );
  const enrichedPantheonBios = topRelatedInPantheonResp.data.map(d => {
    const wikiData = topRelatedJson.pages.find(
      p => `${p.pageid}` === `${d.id}`
    );
    return wikiData
      ? {...d, description: wikiData.description, extract: wikiData.extract}
      : d;
  });
  return Response.json(enrichedPantheonBios);
}
