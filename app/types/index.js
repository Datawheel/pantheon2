import {format} from "d3-format";
import {timeFormat} from "d3-time-format";
import {range} from "d3-array";
import {closest} from "d3plus-common";

export const NUM_RANKINGS = 12;
export const NUM_RANKINGS_PRE = Math.floor(NUM_RANKINGS / 2);
export const NUM_RANKINGS_POST = Math.floor(NUM_RANKINGS / 2);
export const YEAR_BUCKETS = 50;

export const DISMISS_MESSAGE = "DISMISS_MESSAGE";

export const COUNTRY_DEPTH = "COUNTRY";
export const CITY_DEPTH = "CITY";

export const OCCUPATION_DEPTH = "OCCUPATION";
export const INDUSTRY_DEPTH = "INDUSTRY";
export const DOMAIN_DEPTH = "DOMAIN";

export const HPI_RANGE = range(4, 27);
export const LANGS_RANGE = range(15, 20).concat(range(20, 50, 5)).concat(range(50, 100, 15)).concat(range(100, 225, 25));
export const YEAR_RANGE = [-3501, 2015];

// for rankings pages
export const RANKINGS_RESULTS_PER_PAGE = 100;

export const COLORS_DOMAIN = {
  "sports": "#BB3B57",
  "science-technology": "#0E5E5B",
  "public-figure": "#67AF8C",
  "institutions": "#B12D11",
  "humanities": "#732945",
  "exploration": "#4C5ED7",
  "business-law": "#4F680A",
  "arts": "#D28629"
};

export const COLORS_CONTINENT = {
  Africa: "#BB3B57",
  Americas: "#67AF8C",
  Asia: "#D28629",
  Europe: "#5F0116",
  Oceania: "#4C5ED7"
};

function slugifyStr(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc------";

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

export const FORMATTERS = {
  commas: format(","),
  decimal: format(".2f"),
  share: format(",.2%"),
  bigNum: format(".2s"),
  shareWhole: format(",.0%"),
  date: timeFormat("%B %d, %Y"),
  dateShort: timeFormat("%m/%d/%y"),
  month: timeFormat("%B %Y"),
  monthShort: timeFormat("%m/%Y"),
  year: y => y < 0 ? `${Math.abs(y)} BC` : `${Math.round(y)}`,
  ordinal: n => {
    if (n > 3 && n < 21) return `${n}th`; // thanks kennebec
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  },
  slugify: slugifyStr
};

function sanitizeYear(yr) {
  const yearAsNumber = Math.abs(yr.match(/\d+/)[0]);
  if (yr.replace(".", "").toLowerCase().includes("bc") || parseInt(yr, 10) < 0) {
    return yearAsNumber * -1;
  }
  return yearAsNumber;
}

export const SANITIZERS = {
  vizType: viz => {
    const supportedViz = ["treemap", "stackedarea", "linechart", "map"];
    return supportedViz.includes(viz.toLowerCase()) ? viz.toLowerCase() : supportedViz[0];
  },
  show: (showStr, pageType) => {
    let types = ["people", "occupations", "places"];
    const depths = ["people", "occupations", "industries", "domains", "places", "countries"];
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
    // console.log("type, depth", type, depth)
    // return {type, depth};
    return type;
  },
  years: yearStr => {
    if (!yearStr || !yearStr.includes(",")) return YEAR_RANGE;
    return [sanitizeYear(yearStr.split(",")[0]), sanitizeYear(yearStr.split(",")[1])];
  },
  metric: (metricType, cutoff) => {
    metricType = ["hpi", "langs"].includes(metricType) ? metricType : "hpi";
    const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
    if (cutoff) {
      cutoff = cutoff.match(/\d+/) ? parseInt(cutoff.match(/\d+/)[0], 10) : metricRange[0];
      cutoff = closest(cutoff, metricRange);
    }
    else {
      cutoff = metricRange[0];
    }
    return {metricType, cutoff};
  },
  gender: gender => gender === "true" || gender === "false" ? JSON.parse(gender) : null,
  yearType: yearType => yearType === "deathyear" ? yearType : "birthyear",
  placeType: placeType => placeType === "deathplace" ? placeType : "birthplace",
  country: place => place && place.includes("|") ? place.split("|")[0] : place,
  city: place => place && place.includes("|") ? place.split("|")[1] : "all"
};
