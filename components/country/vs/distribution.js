// Use every recorded place for the denominator and the inverse Herfindahl index.
// Place IDs break ties consistently across paginated responses.
export function placeDistribution(places, countKey, countrySlug) {
  const ranked = places.filter(p => p.place && p.slug !== countrySlug && p[countKey] > 0)
    .sort((a, b) => b[countKey] - a[countKey] || a.id - b.id);
  const total = ranked.reduce((sum, p) => sum + p[countKey], 0);
  const sumSquares = ranked.reduce((sum, p) => sum + p[countKey] ** 2, 0);
  return {
    total,
    distinct: ranked.length,
    effective: total ? total ** 2 / sumSquares : null,
    top: ranked.slice(0, 3).map(p => ({
      id: p.id, slug: p.slug, name: p.place, count: p[countKey], share: p[countKey] / total,
    })),
  };
}
