// Crawlers follow serialized URLs like ?id=null or ?country=undefined; treat
// those literals the same as a missing param.
export function cleanParam(value) {
  if (!value) return null;
  const trimmed = value.trim();
  return /^(?:null|undefined)$/i.test(trimmed) ? null : trimmed;
}
