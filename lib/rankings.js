import {plural} from "pluralize";
import {
  formatExploreYear,
  getExploreTranslations,
} from "@/app/exploreTranslations";
import {DEFAULT_LOCALE} from "@/app/locales";
import {HPI_RANGE, LANGS_RANGE, YEAR_RANGE} from "@/components/utils/consts";
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

function formatMonthDay(month, day, locale) {
  const date = new Date(Date.UTC(2000, month - 1, day));
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatMonthOnly(month, locale) {
  const date = new Date(Date.UTC(2000, month - 1, 1));
  return new Intl.DateTimeFormat(locale, {
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

function localizedObjectValue(value, locale, key) {
  return value?.[`localized_${key}`]
    || value?.translations?.[locale]?.[key]
    || value?.translations?.[DEFAULT_LOCALE]?.[key]
    || value?.[key];
}

export function localizeExplorePlaces(places, locale = DEFAULT_LOCALE) {
  return places.map(place => {
    if (!place.country) return place;
    const {
      translations: _translations,
      localized_country: _localizedCountry,
      ...country
    } = place.country;
    return {
      ...place,
      country: {
        ...country,
        country: localizedObjectValue(place.country, locale, "country"),
      },
    };
  });
}

export function localizeExploreOccupations(
  occupations,
  locale = DEFAULT_LOCALE,
) {
  return occupations.map(occupation => {
    const localized = occupation.translations?.[locale]
      || occupation.translations?.[DEFAULT_LOCALE]
      || {};
    const {
      translations: _translations,
      localized_occupation: localizedOccupation,
      localized_industry: localizedIndustry,
      localized_domain: localizedDomain,
      ...occupationData
    } = occupation;
    return {
      ...occupationData,
      occupation: localizedOccupation
        || localized.occupation
        || occupation.occupation,
      industry: localizedIndustry || localized.industry || occupation.industry,
      domain: localizedDomain || localized.domain || occupation.domain,
    };
  });
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

export function buildNestedOccupations(
  occupations,
  locale = DEFAULT_LOCALE,
) {
  const t = getExploreTranslations(locale);
  const grouped = new Map();

  for (const occupation of occupations) {
    const domainSlug = occupation.domain_slug || "unknown";
    if (!grouped.has(domainSlug)) {
      grouped.set(domainSlug, {
        domain: {
          id: "",
          slug: domainSlug,
          name: occupation.domain || t("unknown"),
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

export function buildRankingsHeading(
  exploreState,
  places,
  nestedOccupations,
  locale = DEFAULT_LOCALE,
) {
  const t = getExploreTranslations(locale);
  const {
    city,
    country,
    gender,
    occupation,
    placeType,
    show,
    yearType,
  } = exploreState;

  const allPeople = locale === DEFAULT_LOCALE
    ? lowerFirst(t("people"))
    : t("people");
  const genderedPronoun = gender === "M"
    ? t("men")
    : gender === "F"
      ? t("women")
      : allPeople;

  let occupationSubject = genderedPronoun;
  if (occupation !== "all") {
    if (`${occupation}`.includes(",")) {
      const domain = nestedOccupations.find(group => group.domain.id === occupation);
      const domainName = domain?.domain?.name || t("selected");
      occupationSubject = t("peopleInDomain", {
        people: genderedPronoun,
        domain: domainName,
      });
    } else {
      const occupationLookup = getOccupationLookup(nestedOccupations);
      const selectedOccupation = occupationLookup.find(
        currentOccupation => `${currentOccupation.id}` === `${occupation}`
      );
      const occupationName = selectedOccupation?.occupation || `${occupation}`;
      const pluralOccupation = locale === DEFAULT_LOCALE
        ? plural(occupationName.toLowerCase())
        : occupationName;

      if (gender === "M") {
        occupationSubject = t("maleOccupations", {occupations: pluralOccupation});
      } else if (gender === "F") {
        occupationSubject = t("femaleOccupations", {occupations: pluralOccupation});
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
              ? t("diedInCity", {city: cityMatch.place, country: countryName})
              : t("bornInCity", {city: cityMatch.place, country: countryName});
        }
      } else {
        locationSuffix =
          placeType === "deathplace" || yearType === "deathyear"
            ? t("diedInCountry", {country: countryName})
            : t("bornInPresentCountry", {country: countryName});
      }
    }
  }

  if (show.type === "occupations") {
    return t("occupationsOf", {
      subject: occupationSubject,
      location: locationSuffix,
    }).replace(/\s+/g, " ").trim();
  }
  if (show.type === "places") {
    return t(placeType === "deathplace" ? "deathPlacesOf" : "birthPlacesOf", {
      subject: occupationSubject,
      location: locationSuffix,
    }).replace(/\s+/g, " ").trim();
  }

  return t("memorableSubject", {
    subject: occupationSubject,
    location: locationSuffix,
  }).replace(/\s+/g, " ").trim();
}

export function buildRankingsMetricSentence(
  exploreState,
  locale = DEFAULT_LOCALE,
) {
  const t = getExploreTranslations(locale);
  const {metricCutoff, metricType, onlyShowNew} = exploreState;
  const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;

  let sentence = "";
  if (metricCutoff > metricRange[0]) {
    sentence = onlyShowNew
      ? t("onlyNewAsOf")
      : t("onlyBiographies");

    if (metricType === "hpi") {
      sentence = t("hpiGreaterThan", {prefix: sentence, cutoff: metricCutoff});
    } else {
      sentence = t("languagesGreaterThan", {
        prefix: sentence,
        cutoff: metricCutoff,
      });
    }
  } else if (onlyShowNew) {
    sentence = t("onlyNewAsOf");
  }

  return sentence;
}

export function buildRankingsYearLabel(
  exploreState,
  locale = DEFAULT_LOCALE,
) {
  const years = exploreState?.years || YEAR_RANGE;
  return `${formatExploreYear(years[0], locale)} - ${formatExploreYear(years[1], locale)}`;
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

function buildBirthdayQualifier(exploreState, locale) {
  const t = getExploreTranslations(locale);
  const {birthMonth, birthDay} = exploreState;
  if (birthMonth && birthDay) {
    return t("bornOnDate", {date: formatMonthDay(birthMonth, birthDay, locale)});
  }
  if (birthMonth) {
    return t("bornInMonth", {date: formatMonthOnly(birthMonth, locale)});
  }
  if (birthDay) {
    return t("bornOnDay", {
      day: locale === DEFAULT_LOCALE ? formatOrdinalDay(birthDay) : birthDay,
    });
  }
  return null;
}

function buildMetricQualifier(exploreState, locale) {
  const t = getExploreTranslations(locale);
  const {metricCutoff, metricType} = exploreState;
  const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
  if (!(metricCutoff > metricRange[0])) return null;
  if (metricType === "hpi") return `HPI ≥ ${metricCutoff}`;
  return t("wikipediaLanguages", {count: metricCutoff});
}

export function buildRankingsMetadata(
  exploreState,
  places,
  nestedOccupations,
  locale = DEFAULT_LOCALE,
) {
  const t = getExploreTranslations(locale);
  const heading = buildRankingsHeading(
    exploreState,
    places,
    nestedOccupations,
    locale,
  );
  const queryString = buildRankingsQueryString(exploreState);
  const canonicalPath = queryString
    ? `/explore/rankings?${queryString}`
    : "/explore/rankings";

  const qualifiers = [];
  if (!isDefaultYears(exploreState.years)) {
    qualifiers.push(buildRankingsYearLabel(exploreState, locale));
  }
  const birthdayQualifier = buildBirthdayQualifier(exploreState, locale);
  if (birthdayQualifier) {
    qualifiers.push(birthdayQualifier);
  }
  const metricQualifier = buildMetricQualifier(exploreState, locale);
  if (metricQualifier) {
    qualifiers.push(metricQualifier);
  }
  if (exploreState.onlyShowNew) {
    qualifiers.push(t("newBiographies"));
  }

  const title = qualifiers.length
    ? `${heading} | ${qualifiers.join(" | ")} | ${t("pantheonRankings")}`
    : `${heading} | ${t("pantheonRankings")}`;

  const metricSentence = buildRankingsMetricSentence(exploreState, locale);
  const descriptionParts = [
    t("metadataExplore", {
      heading: locale === DEFAULT_LOCALE ? lowerFirst(heading) : heading,
    }),
    t("metadataCompare"),
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
