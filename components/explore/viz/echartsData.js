import {COLORS_CONTINENT, COLORS_DOMAIN} from "../../utils/consts";
import {
  formatExploreNumber,
  formatExploreYear,
  getExploreTranslations,
} from "@/app/exploreTranslations";
import {
  autoBins,
  calculateLinearYearBuckets,
  calculateYearBucket,
  resolveTimeSeriesScale,
} from "../../utils/vizHelpers";

export const EMPTY_COLOR = "#ccc";

const DOMAIN_ORDER = new Map(
  Object.keys(COLORS_DOMAIN).map((domainSlug, index) => [domainSlug, index])
);
const CONTINENT_ORDER = new Map(
  Object.keys(COLORS_CONTINENT).map((continent, index) => [continent, index])
);

export const TOOLTIP_STYLE = {
  trigger: "item",
  confine: true,
  backgroundColor: "rgba(255, 255, 255, 0.97)",
  borderColor: "#ccc",
  borderWidth: 1,
  padding: [10, 12],
  extraCssText:
    "box-shadow: 0 2px 10px rgba(0,0,0,0.15); max-width: 300px;",
  textStyle: {color: "#333", fontSize: 12, lineHeight: 16},
};

export function escapeHtml(value) {
  return `${value ?? ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatChartValue(value, locale = "en") {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return formatExploreNumber(
    Math.abs(n) >= 10 || Number.isInteger(n) ? Math.round(n) : n,
    locale,
    {maximumFractionDigits: 2},
  );
}

export function setupResize(chart, element) {
  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }

  const handleResize = () => chart.resize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}

function trackTopPeople(topPeople, person, limit = 3) {
  if (!person?.name) return;
  if (topPeople.some(p => p.id === person.id || p.name === person.name)) {
    return;
  }

  const score = person.hpi || 0;
  let inserted = false;
  for (let index = 0; index < topPeople.length; index += 1) {
    if (score > (topPeople[index]?.hpi || 0)) {
      topPeople.splice(index, 0, person);
      inserted = true;
      break;
    }
  }

  if (!inserted && topPeople.length < limit) {
    topPeople.push(person);
  }
  if (topPeople.length > limit) topPeople.length = limit;
}

export function formatTopPeopleHtml(people = [], locale = "en") {
  if (!people.length) return "";

  const t = getExploreTranslations(locale);
  const peopleLabel = people.length === 1
    ? t("topRankedPerson")
    : t("topRankedPeople");
  let html = `<div style="margin-top: 10px; font-size: 10px; letter-spacing: 0.5px; color: #888; text-transform: uppercase;">${escapeHtml(peopleLabel)}</div>`;
  people.forEach(person => {
    const yearStr =
      person.birthyear != null
        ? t("bornAbbreviation", {
            year: formatExploreYear(person.birthyear, locale),
          })
        : "";
    html += `<div style="margin-top: 2px; font-size: 12px;"><strong style="color: #222;">${escapeHtml(person.name)}</strong> <span style="color: #888;">${escapeHtml(yearStr)}</span></div>`;
  });
  return html;
}

function buildOccupationLookup(occupations = []) {
  return occupations.reduce((lookup, occupation) => {
    if (occupation?.id !== undefined && occupation?.id !== null) {
      lookup[`${occupation.id}`] = occupation;
    }
    return lookup;
  }, {});
}

function normalizePerson(person, occupationLookup, locale) {
  const t = getExploreTranslations(locale);
  const occupationId =
    person.occupation_id ?? person.occupation?.id ?? person.occupation;
  const occupation =
    occupationLookup[`${occupationId}`] ||
    (typeof person.occupation === "object" ? person.occupation : null) ||
    {};

  return {
    ...person,
    occupationId:
      occupationId === undefined || occupationId === null
        ? null
        : `${occupationId}`,
    occupationName: occupation.occupation || null,
    occupationSlug: occupation.occupation_slug || null,
    domain: occupation.domain || null,
    domainSlug: occupation.domain_slug || null,
    industry: occupation.industry || null,
    bornCountry: person.bplace_country?.country || null,
    bornCountryId: person.bplace_country?.id || null,
    bornCountrySlug: person.bplace_country?.slug || null,
    bornContinent: person.bplace_country?.continent
      ? t(person.bplace_country.continent.toLowerCase())
      : null,
    bornContinentKey: person.bplace_country?.continent || null,
    bornPlace: person.bplace_geonameid?.place || null,
    bornPlaceId: person.bplace_geonameid?.id || null,
    bornPlaceSlug: person.bplace_geonameid?.slug || null,
  };
}

function domainColor(row) {
  return COLORS_DOMAIN[row.domainSlug] || EMPTY_COLOR;
}

function continentColor(row) {
  return COLORS_CONTINENT[row.bornContinentKey] || EMPTY_COLOR;
}

function occupationLevels() {
  return [
    {
      id: "domain",
      name: row => row.domain,
      color: domainColor,
      order: row => DOMAIN_ORDER.get(row.domainSlug) ?? Number.MAX_SAFE_INTEGER,
    },
    {
      id: "industry",
      name: row => row.industry,
      color: domainColor,
    },
    {
      id: "occupation",
      name: row => row.occupationName,
      color: domainColor,
      profileType: () => "occupation",
      slug: row => row.occupationSlug,
    },
  ];
}

function placeLevels(rows) {
  const countryIds = new Set(rows.map(row => row.bornCountryId).filter(Boolean));

  if (countryIds.size === 1) {
    return [
      {
        id: "country",
        name: row => row.bornCountry,
        color: continentColor,
        order: row =>
          CONTINENT_ORDER.get(row.bornContinentKey) ?? Number.MAX_SAFE_INTEGER,
        profileType: () => "country",
        slug: row => row.bornCountrySlug,
      },
      {
        id: "place",
        name: row => row.bornPlace,
        color: continentColor,
        profileType: () => "place",
        slug: row => row.bornPlaceSlug,
      },
    ];
  }

  return [
    {
      id: "continent",
      name: row => row.bornContinent,
      color: continentColor,
      order: row =>
        CONTINENT_ORDER.get(row.bornContinentKey) ?? Number.MAX_SAFE_INTEGER,
    },
    {
      id: "country",
      name: row => row.bornCountry,
      color: continentColor,
      profileType: () => "country",
      slug: row => row.bornCountrySlug,
    },
  ];
}

function hasYear(row, yearType) {
  return row[yearType] !== null && row[yearType] !== undefined;
}

export function buildExploreRows(
  data,
  occupations,
  show,
  yearType,
  locale = "en",
) {
  const occupationLookup = buildOccupationLookup(occupations);
  let rows = (data || []).map(person =>
    normalizePerson(person, occupationLookup, locale)
  );

  if (show?.type === "places") {
    rows = rows.filter(
      row =>
        row.occupationId &&
        hasYear(row, yearType) &&
        row.bornCountry &&
        row.bornContinent
    );

    const levels = placeLevels(rows);
    if (levels.some(level => level.id === "place")) {
      rows = rows.filter(row => row.bornPlace);
    }

    return {rows, levels, mode: "places"};
  }

  rows = rows.filter(row => row.occupationId && row.occupationName);
  return {rows, levels: occupationLevels(), mode: "occupations"};
}

function rowPath(row, levels) {
  const path = levels.map(level => ({
    id: level.id,
    name: level.name(row),
    color: level.color(row),
    order: level.order?.(row) ?? Number.MAX_SAFE_INTEGER,
    profileType: level.profileType?.(row) || null,
    slug: level.slug?.(row) || null,
  }));

  return path.every(part => part.name) ? path : null;
}

function convertNodeMap(nodeMap) {
  return Array.from(nodeMap.values())
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
    .map(node => {
      const children = node.childrenMap.size
        ? convertNodeMap(node.childrenMap)
        : undefined;
      const result = {
        name: node.name,
        value: node.value,
        itemStyle: {color: node.color},
        topPeople: node.topPeople,
        profileType: node.profileType,
        slug: node.slug,
      };
      if (children) result.children = children;
      return result;
    });
}

export function buildTreeData(rows, levels) {
  const rootMap = new Map();

  rows.forEach(row => {
    const path = rowPath(row, levels);
    if (!path) return;

    let currentMap = rootMap;
    path.forEach(part => {
      const key = `${part.id}:${part.name}`;
      let node = currentMap.get(key);
      if (!node) {
        node = {
          name: part.name,
          color: part.color,
          value: 0,
          topPeople: [],
          profileType: part.profileType,
          slug: part.slug,
          childrenMap: new Map(),
        };
        currentMap.set(key, node);
      }
      node.value += 1;
      trackTopPeople(node.topPeople, row);
      currentMap = node.childrenMap;
    });
  });

  return convertNodeMap(rootMap);
}

export function treeTotal(treeData) {
  return treeData.reduce((sum, node) => sum + (node.value || 0), 0);
}

export function legendItemsFromTree(treeData) {
  return treeData
    .map(node => ({
      name: node.name,
      color: node.itemStyle?.color || EMPTY_COLOR,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function buildTimeSeries(rows, levels, yearType, options = {}) {
  const {
    yearRange = null,
    scale = null,
    binCount = null,
    percent = false,
  } = options;
  const effectiveScale = resolveTimeSeriesScale(yearRange, scale);

  const bucketRows = rows
    .filter(row => hasYear(row, yearType))
    .map(row => ({...row}));
  if (!bucketRows.length) {
    return {
      labels: [],
      ticks: [],
      series: [],
      legendItems: [],
      bucketCounts: [],
      scale: effectiveScale,
      binCount: 0,
      percent,
    };
  }

  const effectiveBins = binCount ?? autoBins(yearRange, effectiveScale);
  const accessor = row => Number(row[yearType]);

  // Trim the binning/axis domain to the years that actually contain data. The
  // user may select up to e.g. 2025, but the most recent years are typically
  // empty — binning across them produces near-empty trailing bins (a visual
  // cliff, and noisy percentages). (Log binning already self-trims via extent.)
  let dataMin = Infinity;
  let dataMax = -Infinity;
  for (const row of bucketRows) {
    const year = accessor(row);
    if (year < dataMin) dataMin = year;
    if (year > dataMax) dataMax = year;
  }
  let domain = yearRange;
  if (
    Array.isArray(yearRange) &&
    Number.isFinite(dataMin) &&
    Number.isFinite(dataMax)
  ) {
    const lo = Math.max(Math.min(yearRange[0], yearRange[1]), dataMin);
    const hi = Math.min(Math.max(yearRange[0], yearRange[1]), dataMax);
    if (hi > lo) domain = [lo, hi];
  }

  const [labels, ticks] =
    effectiveScale === "linear"
      ? calculateLinearYearBuckets(bucketRows, accessor, effectiveBins, domain)
      : calculateYearBucket(bucketRows, accessor, {buckets: effectiveBins});

  const seriesMap = new Map();
  const groupTotals = new Map();
  const bucketCounts = Array(labels.length).fill(0); // raw people per bin
  const bucketPlotted = Array(labels.length).fill(0); // plotted value per bin

  bucketRows.forEach(row => {
    const path = rowPath(row, levels);
    if (!path) return;

    const group = path[0];
    const leaf = path[path.length - 1];
    const key = path.map(part => part.name).join(" › ");
    let series = seriesMap.get(key);
    if (!series) {
      series = {
        key,
        name: leaf.name,
        color: leaf.color,
        groupName: group.name,
        groupColor: group.color,
        groupOrder: group.order,
        values: Array(labels.length).fill(0),
        counts: Array(labels.length).fill(0),
        total: 0,
        totalCount: 0,
        // top people by HPI tracked per year bucket (for the hover tooltip)
        bucketTopPeople: Array.from({length: labels.length}, () => []),
      };
      seriesMap.set(key, series);
    }

    const bucketIndex = Number(row.yearBucket);
    const value = row.yearWeight || 0;
    if (
      Number.isFinite(bucketIndex) &&
      bucketIndex >= 0 &&
      bucketIndex < labels.length
    ) {
      series.values[bucketIndex] += value;
      series.counts[bucketIndex] += 1;
      series.total += value;
      series.totalCount += 1;
      bucketCounts[bucketIndex] += 1;
      bucketPlotted[bucketIndex] += value;
      groupTotals.set(group.name, (groupTotals.get(group.name) || 0) + value);
      trackTopPeople(series.bucketTopPeople[bucketIndex], row, 5);
    }
  });

  const compareSeries = (a, b) =>
    a.groupOrder - b.groupOrder ||
    (groupTotals.get(b.groupName) || 0) - (groupTotals.get(a.groupName) || 0) ||
    a.groupName.localeCompare(b.groupName) ||
    b.total - a.total ||
    a.name.localeCompare(b.name);

  const series = Array.from(seriesMap.values()).sort(compareSeries);

  if (percent) {
    series.forEach(item => {
      item.values = item.values.map((value, index) =>
        bucketPlotted[index] ? (value / bucketPlotted[index]) * 100 : 0
      );
    });
  }

  const legendItems = Array.from(
    new Map(
      series.map(item => [
        item.groupName,
        {
          name: item.groupName,
          color: item.groupColor,
          order: item.groupOrder,
          total: groupTotals.get(item.groupName) || 0,
        },
      ])
    ).values()
  ).sort(
    (a, b) =>
      a.order - b.order ||
      b.total - a.total ||
      a.name.localeCompare(b.name)
  );

  return {
    labels,
    ticks,
    series,
    legendItems,
    bucketCounts,
    scale: effectiveScale,
    binCount: effectiveBins,
    percent,
  };
}
