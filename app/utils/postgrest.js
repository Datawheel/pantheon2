export function encodePostgrestValue(value) {
  return encodeURIComponent(String(value)).replaceAll("%20", "+");
}

export function encodePostgrestList(values) {
  return values.map(encodePostgrestValue).join(",");
}

// PostgREST `in` values containing commas, parentheses, or quotes must be
// double-quoted or they are parsed as separate list entries. Quoting every
// value keeps mixed slug lists safe without special-casing punctuation.
export function encodePostgrestQuotedList(values) {
  return values
    .map(value => {
      const escaped = String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll('"', '\\"');
      return `%22${encodePostgrestValue(escaped)}%22`;
    })
    .join(",");
}
