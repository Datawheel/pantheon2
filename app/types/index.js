export const NUM_RANKINGS = 12;
export const NUM_RANKINGS_PRE = Math.floor(NUM_RANKINGS/2);
export const NUM_RANKINGS_POST = Math.floor(NUM_RANKINGS/2);
export const YEAR_BUCKETS = 50;

export const DISMISS_MESSAGE = 'DISMISS_MESSAGE';

export const COUNTRY_DEPTH = "COUNTRY";
export const CITY_DEPTH = "CITY";

export const OCCUPATION_DEPTH = "OCCUPATION";
export const INDUSTRY_DEPTH = "INDUSTRY";
export const DOMAIN_DEPTH = "DOMAIN";

// for rankings pages
export const RANKINGS_RESULTS_PER_PAGE = 20;

export const COLORS_DOMAIN = {
  sports: "#BB3B57",
  science_and_technology: "#0E5E5B",
  public_figure: "#67AF8C",
  institutions: "#B12D11",
  humanities: "#732945",
  exploration: "#4C5ED7",
  business_and_law: "#4F680A",
  arts: "#D28629"
};

export const COLORS_CONTINENT = {
  Africa: "#BB3B57",
  Americas: "#67AF8C",
  Asia: "#D28629",
  Europe: "#5F0116",
  Oceania: "#4C5ED7"
}

import {format} from "d3-format";
import {timeFormat} from "d3-time-format";

export const FORMATTERS = {
  commas: format(","),
  share: format(".2%"),
  shareWhole: format(".0%"),
  date: timeFormat("%B %d, %Y"),
  year: (y) => y < 0 ? `${Math.abs(y)} BC` : y,
  ordinal: (n) => {
    if(n>3 && n<21) return `${n}th`; // thanks kennebec
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }
}
