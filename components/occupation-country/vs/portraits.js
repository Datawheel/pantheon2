// Pantheon person IDs with prepared, transparent portraits.
const portraits = {
  "soccer-player": {argentina: 8485, brazil: 24953},
  composer: {austria: 33163, germany: 17914},
  painter: {france: 6548, italy: 21019},
  architect: {russia: 1897503, switzerland: 17900},
  physicist: {germany: 736, "united-kingdom": 14627},
  writer: {france: 42146, russia: 11625},
  "film-director": {japan: 20312, "united-states": 26940},
  "tennis-player": {spain: 1439517, switzerland: 262376},
  singer: {egypt: 214221, lebanon: 484591},
  philosopher: {germany: 10671, greece: 308},
  "fashion-designer": {france: 11291214, italy: 489914},
  "chess-player": {india: 281337, russia: 63280},
};

export function portraitId(occupation, country) {
  return portraits[occupation]?.[country];
}

export function cutoutSrc(id) {
  return `/images/vs/portraits/${id}.webp`;
}

const additionalPortraits = {
  japan: [43357, 872],
  italy: [44525],
  argentina: [2150841, 615788],
  brazil: [700574, 615810],
};

export function countryPortraitIds(slug) {
  return [...Object.values(portraits).map(group => group[slug]).filter(Boolean),
    ...(additionalPortraits[slug] || [])].slice(0, 3);
}
