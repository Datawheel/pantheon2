import {COLORS_DOMAIN_PASTEL} from "@/components/utils/consts";

// Backdrops for comparison posters and cards. A single occupation takes its
// domain's pastel; comparisons across all occupations get a neutral sand and
// a stripe with every domain, in the treemap legend's order.
const ALL_OCCUPATIONS = {bg: "#f3eadc", wash: "#e6d4ba"};
const domains = Object.values(COLORS_DOMAIN_PASTEL);
const SPECTRUM = `linear-gradient(90deg, ${domains.map(({wash}, i) =>
  `${wash} ${(100 * i / domains.length).toFixed(1)}% ${(100 * (i + 1) / domains.length).toFixed(1)}%`).join(", ")})`;

/** CSS custom properties: --vs-paper, --vs-wash and --vs-stripe. */
export function vsBackdrop(domainSlug) {
  const pastel = COLORS_DOMAIN_PASTEL[domainSlug];
  return {
    "--vs-paper": (pastel || ALL_OCCUPATIONS).bg,
    "--vs-wash": (pastel || ALL_OCCUPATIONS).wash,
    "--vs-stripe": pastel ? "none" : SPECTRUM,
  };
}
