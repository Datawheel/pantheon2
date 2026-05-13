export function closest(n, values = []) {
  if (!Array.isArray(values) || !values.length) return undefined;

  return values.reduce((prev, curr) =>
    Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev
  );
}
