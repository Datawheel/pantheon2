// Country-vs-country pages for one occupation
// (/profile/occupation/soccer-player/country/argentina/vs/brazil).
// Pure helpers shared by the page, the occupation × country page and the
// sitemap, so all three agree on which pairs exist and how they're spelled.

// Both countries need at least this many people for the page to render.
export const VS_MIN_PEOPLE = 3;

// Pairs submitted in the sitemap: among each occupation's top countries by
// count, both with a real list. ~2,300 pairs.
export const VS_SITEMAP_TOP = 10;
export const VS_SITEMAP_MIN_PEOPLE = 10;

// Link at least this many comparisons from a page when enough exist.
const MIN_RIVALS = 4;

// One URL per pair: slugs in alphabetical order. The reverse order
// redirects, so "brazil/vs/argentina" and "argentina/vs/brazil" never
// compete with each other.
export function vsSlugs(slugA, slugB) {
  return slugA <= slugB ? [slugA, slugB] : [slugB, slugA];
}

export function vsPath(occupationSlug, slugA, slugB) {
  const [a, b] = vsSlugs(slugA, slugB);
  return `/profile/occupation/${occupationSlug}/country/${a}/vs/${b}`;
}

const rowSlug = row => row.country_data?.slug || row.country_slug;

// Side B's color on comparison pages: a contrasting hue for each domain
// color (side A uses the domain color itself, COLORS_DOMAIN).
export const VS_SIDE_B_COLORS = {
  "sports": "#2f6690",
  "science-technology": "#b5651d",
  "public-figure": "#5b4b8a",
  "institutions": "#2f6690",
  "humanities": "#2f7a78",
  "exploration": "#b5651d",
  "business-law": "#7a3e9d",
  "arts": "#2f5d8a",
};

/**
 * Countries worth comparing with `countryId` for this occupation, as
 * standings rows (sorted by num_people desc). Countries in the sitemap set
 * link to each other; everyone else gets the leaders plus their immediate
 * neighbors in the table.
 */
export function pickRivals(standings, countryId, {exclude = [], max = 8} = {}) {
  const index = standings.findIndex(row => row.country === countryId);
  if (index < 0 || standings[index].num_people < VS_MIN_PEOPLE) return [];
  const skip = new Set([countryId, ...exclude]);
  const eligible = (row, min = VS_MIN_PEOPLE) =>
    row && !skip.has(row.country) && row.num_people >= min && rowSlug(row);

  const picks = [];
  const add = row => {
    if (eligible(row) && !picks.includes(row)) picks.push(row);
  };

  const current = standings[index];
  if (index < VS_SITEMAP_TOP && current.num_people >= VS_SITEMAP_MIN_PEOPLE) {
    // The sitemap pairs first; top up with smaller countries if the
    // occupation only has a few big ones (US vs UK YouTubers, then Canada…).
    picks.push(...standings
      .slice(0, VS_SITEMAP_TOP)
      .filter(row => eligible(row, VS_SITEMAP_MIN_PEOPLE)));
    standings.slice(0, VS_SITEMAP_TOP).forEach(row => picks.length < MIN_RIVALS && add(row));
    return picks.slice(0, max);
  }

  standings.slice(0, 4).forEach(add);
  add(standings[index - 1]);
  add(standings[index + 1]);
  return picks.slice(0, max);
}

export {rowSlug};
