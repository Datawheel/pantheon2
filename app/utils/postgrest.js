export function encodePostgrestValue(value) {
  return encodeURIComponent(String(value)).replaceAll("%20", "+");
}

export function encodePostgrestList(values) {
  return values.map(encodePostgrestValue).join(",");
}
