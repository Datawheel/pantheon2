const sanitizeYear = (yr) => {
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
  vizType: (viz) => {
    const supportedViz = ["treemap", "stackedarea", "linechart", "map"];
    return supportedViz.includes(viz.toLowerCase())
      ? viz.toLowerCase()
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
    return { type, depth };
  },
  years: (yearStr) => {
    if (!yearStr || !yearStr.includes(",")) return YEAR_RANGE;
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
    return { metricType, cutoff };
  },
  gender: (gender) =>
    ["F", "f", "M", "m"].includes(gender) ? gender.toUpperCase() : null,
  yearType: (yearType) => (yearType === "deathyear" ? yearType : "birthyear"),
  placeType: (placeType) =>
    placeType === "deathplace" ? placeType : "birthplace",
  country: (place) =>
    place
      ? place.includes("|")
        ? place.split("|")[0].toLowerCase()
        : place.toLowerCase()
      : place,
  city: (place) => (place && place.includes("|") ? place.split("|")[1] : "all"),
};
