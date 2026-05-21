import {HPI_RANGE, LANGS_RANGE, VIZ_YEAR_RANGE, YEAR_RANGE} from "@/components/utils/consts";
import {closest} from "@/components/utils/math";

const sanitizeYear = yr => {
  const yearAsNumber = Math.abs(yr.match(/\d+/)[0]);
  if (
    yr.replace(".", "").toLowerCase().includes("bc") ||
    parseInt(yr, 10) < 0
  ) {
    return yearAsNumber * -1;
  }
  return yearAsNumber;
};

export const SANITIZERS = {
  vizType: viz => {
    const supportedViz = ["stackedarea", "treemap", "linechart", "map"];
    const normalizedViz = `${viz || ""}`.toLowerCase();
    return supportedViz.includes(normalizedViz)
      ? normalizedViz
      : supportedViz[0];
  },
  show: (showStr, pageType) => {
    let types = ["people", "occupations", "places"];
    const depths = [
      "people",
      "occupations",
      "industries",
      "domains",
      "places",
      "countries",
    ];
    let type = showStr;
    let depth;
    if (type && type.includes("|")) {
      [type, depth] = type.split("|");
    }
    if (pageType === "viz") {
      types = ["occupations", "places"];
    }
    type = types.includes(type) ? type : types[0];
    depth = depths.includes(depth) ? depth : null;
    if (!depth && type === "people") depth = "people";
    if (!depth && type === "occupations") depth = "occupations";
    if (!depth && type === "places") depth = "places";
    return {type, depth};
  },
  years: (yearStr, pageType) => {
    const defaultRange = pageType === "viz" ? VIZ_YEAR_RANGE : YEAR_RANGE;
    if (!yearStr || !yearStr.includes(",")) return defaultRange;
    return [
      sanitizeYear(yearStr.split(",")[0]),
      sanitizeYear(yearStr.split(",")[1]),
    ];
  },
  metric: (metricType, cutoff) => {
    metricType = ["hpi", "langs"].includes(metricType) ? metricType : "hpi";
    const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
    if (cutoff) {
      cutoff = cutoff.match(/\d+/)
        ? parseInt(cutoff.match(/\d+/)[0], 10)
        : metricRange[0];
      cutoff = closest(cutoff, metricRange);
    } else {
      cutoff = metricRange[0];
    }
    return {metricType, cutoff};
  },
  gender: gender =>
    ["F", "f", "M", "m"].includes(gender) ? gender.toUpperCase() : null,
  yearType: yearType => (yearType === "deathyear" ? "deathyear" : "birthyear"),
  placeType: placeType =>
    placeType === "deathplace" ? placeType : "birthplace",
  country: place =>
    place
      ? place.includes("|")
        ? place.split("|")[0].toLowerCase()
        : place.toLowerCase()
      : place,
  city: place => (place && place.includes("|") ? place.split("|")[1] : "all"),
  occupation: (potentialOccupation, validOccupations) =>
    validOccupations.find(vo => vo.id === potentialOccupation)
      ? potentialOccupation
      : null,
  new: potentialNew => potentialNew === "true" || false,
  birthMonth: month => {
    if (!month) return null;
    const parsed = parseInt(month, 10);
    return parsed >= 1 && parsed <= 12 ? parsed : null;
  },
  birthDay: day => {
    if (!day) return null;
    const parsed = parseInt(day, 10);
    return parsed >= 1 && parsed <= 31 ? parsed : null;
  },
  // Time-series scale for stacked/line charts; null = auto
  tsScale: scale =>
    scale === "linear" || scale === "log" ? scale : null,
  // Number of year groupings for stacked/line charts; null = auto
  tsBins: bins => {
    if (!bins) return null;
    const parsed = parseInt(bins, 10);
    if (!Number.isFinite(parsed)) return null;
    return Math.min(Math.max(parsed, 4), 50);
  },
  // Stacked-chart percentage toggle
  stackedPercent: pct => pct === "true",
};
