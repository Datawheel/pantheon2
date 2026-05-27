import {plural} from "pluralize";
import {FORMATTERS, HPI_RANGE, LANGS_RANGE, YEAR_RANGE} from "@/components/utils/consts";
import {SANITIZERS} from "@/components/utils/sanitizers";

function getSearchParam(searchParams, key) {
  if (!searchParams) return undefined;
  if (typeof searchParams.get === "function") {
    return searchParams.get(key) ?? undefined;
  }
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function getClosestValue(values, target) {
  return values.reduce((closest, current) =>
    Math.abs(current - target) < Math.abs(closest - target) ? current : closest
  );
}

function getMetricState(searchParams) {
  const hpiValue = getSearchParam(searchParams, "hpi");
  if (hpiValue !== undefined) {
    const parsed = parseInt(`${hpiValue}`.replace(/[^\d-]/g, ""), 10);
    return {
      metricType: "hpi",
      metricCutoff: Number.isFinite(parsed)
        ? getClosestValue(HPI_RANGE, parsed)
        : HPI_RANGE[0],
    };
  }

  const langsValue = getSearchParam(searchParams, "l")
    ?? getSearchParam(searchParams, "langs");
  if (langsValue !== undefined) {
    const parsed = parseInt(`${langsValue}`.replace(/[^\d-]/g, ""), 10);
    return {
      metricType: "l",
      metricCutoff: Number.isFinite(parsed)
        ? getClosestValue(LANGS_RANGE, parsed)
        : LANGS_RANGE[0],
    };
  }

  return {
    metricType: "hpi",
    metricCutoff: HPI_RANGE[0],
  };
}

function isValidOccupationValue(value, occupations = []) {
  if (!value || value === "all") return false;

  const occupationIds = new Set(occupations.map(occupation => `${occupation.id}`));
  if (occupationIds.has(`${value}`)) {
    return true;
  }

  if (`${value}`.includes(",")) {
    const ids = `${value}`
      .split(",")
      .map(id => id.trim())
      .filter(Boolean);
    return ids.length > 0 && ids.every(id => occupationIds.has(id));
  }

  return false;
}

function isDefaultYears(years) {
  return years[0] === YEAR_RANGE[0] && years[1] === YEAR_RANGE[1];
}

function formatMonthDay(month, day) {
  const date = new Date(Date.UTC(2000, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatMonthOnly(month) {
  const date = new Date(Date.UTC(2000, month - 1, 1));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC",
  }).format(date);
}

function formatOrdinalDay(day) {
  const remainderHundred = day % 100;
  const remainderTen = day % 10;
  let suffix = "th";
  if (remainderHundred < 11 || remainderHundred > 13) {
    if (remainderTen === 1) suffix = "st";
    else if (remainderTen === 2) suffix = "nd";
    else if (remainderTen === 3) suffix = "rd";
  }
  return `${day}${suffix}`;
}

function lowerFirst(text) {
  if (!text) return text;
  return `${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

function getOccupationLookup(nestedOccupations) {
  return nestedOccupations.flatMap(group => group.occupations);
}

export function buildNestedPlaces(places) {
  const grouped = new Map();

  for (const place of places) {
    if (!place?.country) continue;
    const countryId = `${place.country_id}`;
    if (!grouped.has(countryId)) {
      grouped.set(countryId, {
        country: place.country,
        cities: [],
      });
    }
    grouped.get(countryId).cities.push(place);
  }

  return Array.from(grouped.values());
}

export function buildNestedOccupations(occupations) {
  const grouped = new Map();

  for (const occupation of occupations) {
    const domainSlug = occupation.domain_slug || "unknown";
    if (!grouped.has(domainSlug)) {
      grouped.set(domainSlug, {
        domain: {
          id: "",
          slug: domainSlug,
          name: occupation.domain || "Unknown",
        },
        occupations: [],
      });
    }
    grouped.get(domainSlug).occupations.push(occupation);
  }

  return Array.from(grouped.values()).map(group => ({
    ...group,
    domain: {
      ...group.domain,
      id: `${group.occupations.map(occupation => occupation.id)}`,
    },
  }));
}

export function parseRankingsSearchParams(searchParams, occupations = [], pageType = "rankings") {
  const show = SANITIZERS.show(getSearchParam(searchParams, "show"), pageType);
  const place = getSearchParam(searchParams, "place");
  const years = SANITIZERS.years(getSearchParam(searchParams, "years"), pageType);
  const normalizedYears = years[0] <= years[1] ? years : [years[1], years[0]];
  const occupationValue = getSearchParam(searchParams, "occupation");
  const metricState = getMetricState(searchParams);

  return {
    viz: SANITIZERS.vizType(getSearchParam(searchParams, "viz")),
    show,
    country: SANITIZERS.country(place) || "all",
    city: SANITIZERS.city(place) || "all",
    gender: SANITIZERS.gender(getSearchParam(searchParams, "gender")),
    occupation: isValidOccupationValue(occupationValue, occupations)
      ? occupationValue
      : "all",
    onlyShowNew: SANITIZERS.new(getSearchParam(searchParams, "new")),
    placeType: SANITIZERS.placeType(getSearchParam(searchParams, "placeType")),
    years: normalizedYears,
    yearType: SANITIZERS.yearType(getSearchParam(searchParams, "yearType")),
    birthMonth: SANITIZERS.birthMonth(getSearchParam(searchParams, "birthMonth")),
    birthDay: SANITIZERS.birthDay(getSearchParam(searchParams, "birthDay")),
    tsScale: SANITIZERS.tsScale(getSearchParam(searchParams, "scale")),
    tsBins: SANITIZERS.tsBins(getSearchParam(searchParams, "bins")),
    stackedPercent: SANITIZERS.stackedPercent(getSearchParam(searchParams, "pct")),
    ...metricState,
  };
}

export function buildRankingsHeading(exploreState, places, nestedOccupations) {
  const {
    city,
    country,
    gender,
    occupation,
    placeType,
    show,
    yearType,
  } = exploreState;

  const genderedPronoun =
    gender === "M" ? "men" : gender === "F" ? "women" : "people";

  let occupationSubject = genderedPronoun;
  if (occupation !== "all") {
    if (`${occupation}`.includes(",")) {
      const domain = nestedOccupations.find(group => group.domain.id === occupation);
      const domainName = domain?.domain?.name || "selected";
      occupationSubject = `${genderedPronoun} in ${domainName.toLowerCase()} occupations`;
    } else {
      const occupationLookup = getOccupationLookup(nestedOccupations);
      const selectedOccupation = occupationLookup.find(
        currentOccupation => `${currentOccupation.id}` === `${occupation}`
      );
      const occupationName = selectedOccupation?.occupation || `${occupation}`;
      const pluralOccupation = plural(occupationName.toLowerCase());

      if (gender === "M") {
        occupationSubject = `male ${pluralOccupation}`;
      } else if (gender === "F") {
        occupationSubject = `female ${pluralOccupation}`;
      } else {
        occupationSubject = pluralOccupation;
      }
    }
  }

  let locationSuffix = "";
  if (country !== "all") {
    const countryGroup = places.find(
      placeGroup => `${placeGroup.country.country_code}`.toLowerCase() === `${country}`.toLowerCase()
    );
    const countryName = countryGroup?.country?.country;

    if (countryName) {
      if (city !== "all") {
        const cityMatch = countryGroup.cities.find(
          currentCity => `${currentCity.id}` === `${city}`
        );
        if (cityMatch) {
          locationSuffix =
            placeType === "deathplace" || yearType === "deathyear"
              ? ` who died in ${cityMatch.place}, ${countryName}`
              : ` born in ${cityMatch.place}, ${countryName}`;
        }
      } else {
        locationSuffix =
          placeType === "deathplace" || yearType === "deathyear"
            ? ` who died in ${countryName}`
            : ` born in present day ${countryName}`;
      }
    }
  }

  if (show.type === "occupations") {
    return `Occupations of memorable ${occupationSubject}${locationSuffix}`.trim();
  }
  if (show.type === "places") {
    const placeLabel = placeType === "deathplace" ? "Death places" : "Birth places";
    return `${placeLabel} of memorable ${occupationSubject}${locationSuffix}`.trim();
  }

  return `Memorable ${occupationSubject}${locationSuffix}`.trim();
}

export function buildRankingsMetricSentence(exploreState) {
  const {metricCutoff, metricType, onlyShowNew} = exploreState;
  const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;

  let sentence = "";
  if (metricCutoff > metricRange[0]) {
    sentence = onlyShowNew
      ? "Only showing newly added biographies (as of 2024)"
      : "Only showing biographies";

    if (metricType === "hpi") {
      sentence = `${sentence} with a Historical Popularity Index (HPI) greater than ${metricCutoff}.`;
    } else {
      sentence = `${sentence} with more than ${metricCutoff} Wikipedia language editions.`;
    }
  } else if (onlyShowNew) {
    sentence = "Only showing newly added biographies (as of 2024)";
  }

  return sentence;
}

export function buildRankingsYearLabel(exploreState) {
  const years = exploreState?.years || YEAR_RANGE;
  return `${FORMATTERS.year(years[0])} - ${FORMATTERS.year(years[1])}`;
}

export function buildRankingsQueryString(exploreState) {
  const params = [];
  const showValue =
    exploreState.show.depth === exploreState.show.type
      ? exploreState.show.type
      : `${exploreState.show.type}|${exploreState.show.depth}`;

  if (showValue !== "people") {
    params.push(`show=${encodeURIComponent(showValue)}`);
  }
  if (!isDefaultYears(exploreState.years)) {
    params.push(`years=${encodeURIComponent(exploreState.years.join(","))}`);
  }
  if (exploreState.country !== "all") {
    let placeValue = `${exploreState.country}`.toLowerCase();
    if (exploreState.city !== "all") {
      placeValue = `${placeValue}|${exploreState.city}`;
    }
    params.push(`place=${encodeURIComponent(placeValue)}`);
  }
  if (exploreState.occupation !== "all") {
    params.push(`occupation=${encodeURIComponent(exploreState.occupation)}`);
  }
  if (exploreState.yearType !== "birthyear") {
    params.push(`yearType=${encodeURIComponent(exploreState.yearType)}`);
  }
  if (exploreState.placeType !== "birthplace") {
    params.push(`placeType=${encodeURIComponent(exploreState.placeType)}`);
  }
  if (exploreState.gender) {
    params.push(`gender=${encodeURIComponent(exploreState.gender)}`);
  }
  if (exploreState.metricType === "hpi" && exploreState.metricCutoff > HPI_RANGE[0]) {
    params.push(`hpi=${encodeURIComponent(exploreState.metricCutoff)}`);
  }
  if (exploreState.metricType === "l" && exploreState.metricCutoff > LANGS_RANGE[0]) {
    params.push(`l=${encodeURIComponent(exploreState.metricCutoff)}`);
  }
  if (exploreState.onlyShowNew) {
    params.push("new=true");
  }
  if (exploreState.birthMonth !== null) {
    params.push(`birthMonth=${encodeURIComponent(exploreState.birthMonth)}`);
  }
  if (exploreState.birthDay !== null) {
    params.push(`birthDay=${encodeURIComponent(exploreState.birthDay)}`);
  }

  return params.join("&");
}

function buildBirthdayQualifier(exploreState) {
  const {birthMonth, birthDay} = exploreState;
  if (birthMonth && birthDay) {
    return `Born on ${formatMonthDay(birthMonth, birthDay)}`;
  }
  if (birthMonth) {
    return `Born in ${formatMonthOnly(birthMonth)}`;
  }
  if (birthDay) {
    return `Born on the ${formatOrdinalDay(birthDay)}`;
  }
  return null;
}

function buildMetricQualifier(exploreState) {
  const {metricCutoff, metricType} = exploreState;
  const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
  if (!(metricCutoff > metricRange[0])) return null;
  if (metricType === "hpi") return `HPI ≥ ${metricCutoff}`;
  return `${metricCutoff}+ Wikipedia languages`;
}

export function buildRankingsMetadata(exploreState, places, nestedOccupations) {
  const heading = buildRankingsHeading(exploreState, places, nestedOccupations);
  const queryString = buildRankingsQueryString(exploreState);
  const canonicalPath = queryString
    ? `/explore/rankings?${queryString}`
    : "/explore/rankings";

  const qualifiers = [];
  if (!isDefaultYears(exploreState.years)) {
    qualifiers.push(buildRankingsYearLabel(exploreState));
  }
  const birthdayQualifier = buildBirthdayQualifier(exploreState);
  if (birthdayQualifier) {
    qualifiers.push(birthdayQualifier);
  }
  const metricQualifier = buildMetricQualifier(exploreState);
  if (metricQualifier) {
    qualifiers.push(metricQualifier);
  }
  if (exploreState.onlyShowNew) {
    qualifiers.push("New biographies");
  }

  const title = qualifiers.length
    ? `${heading} | ${qualifiers.join(" | ")} | Pantheon Rankings`
    : `${heading} | Pantheon Rankings`;

  const metricSentence = buildRankingsMetricSentence(exploreState);
  const descriptionParts = [
    `Explore Pantheon rankings for ${lowerFirst(heading)}.`,
    "Compare people, occupations, and places across historical popularity, geography, and time.",
  ];

  if (metricSentence) {
    descriptionParts.push(metricSentence);
  }

  return {
    heading,
    title,
    description: descriptionParts.join(" "),
    canonicalPath,
  };
}
