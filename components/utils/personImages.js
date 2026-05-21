export const PERSON_IMAGE_BASE = "https://static.pantheon.world/profile/people";
export const STATIC_IMAGE_BASE = "https://static.pantheon.world";
export const DEFAULT_PERSON_FALLBACK_SRC = "/images/icons/icon-person.svg";

const FALLBACK_IMAGE_DIR = "/images/fallback";
const OCCUPATION_ALIASES = {
  "film-director": "director",
  director: "director",
};

export function getPersonImageSrc(id) {
  return id ? `${PERSON_IMAGE_BASE}/${id}.jpg` : "";
}

export function resolvePersonImageSrc(src) {
  if (!src) return "";
  if (src === `${STATIC_IMAGE_BASE}/icons/icon-person.svg`) {
    return DEFAULT_PERSON_FALLBACK_SRC;
  }
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/profile/")) return `${STATIC_IMAGE_BASE}${src}`;
  return src;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getOccupationValue(personOrOccupation) {
  const value = personOrOccupation?.occupation || personOrOccupation;

  if (!value) return "";
  if (typeof value === "string") return value;

  return (
    value.occupation_slug || value.slug || value.id || value.occupation || ""
  );
}

export function getPersonOccupationSlug(personOrOccupation) {
  const person = personOrOccupation || {};
  const value =
    person.occupation_slug ||
    person.occupationSlug ||
    getOccupationValue(person) ||
    person.occupation_name ||
    person.primary_meta;
  const slug = slugify(value);
  return OCCUPATION_ALIASES[slug] || slug;
}

export function getPersonGenderSuffix(personOrGender) {
  const raw =
    typeof personOrGender === "string"
      ? personOrGender
      : personOrGender?.gender || personOrGender?.sex || "";
  const normalized = String(raw).trim().toLowerCase();

  if (normalized === "f" || normalized === "female" || normalized === "woman") {
    return "f";
  }
  if (normalized === "m" || normalized === "male" || normalized === "man") {
    return "m";
  }

  return "";
}

export function getOccupationFallbackSrc(person) {
  const occupation = getPersonOccupationSlug(person);
  const gender = getPersonGenderSuffix(person);

  if (!occupation || !gender) return "";

  return `${FALLBACK_IMAGE_DIR}/fallback-${occupation}-${gender}.webp`;
}

export function getPersonFallbackSources(
  person,
  fallbackSrc = DEFAULT_PERSON_FALLBACK_SRC,
) {
  const sources = [getOccupationFallbackSrc(person), fallbackSrc]
    .map(resolvePersonImageSrc)
    .filter(Boolean);

  return Array.from(new Set(sources));
}
