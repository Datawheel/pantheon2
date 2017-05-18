import {FORMATTERS} from "types";
import {default as topojson} from "json/world-50m.json";

function uniques(a) {
  const v = Array.from(new Set(a));
  return v.length === 1 ? v[0] : v;
}

export default {

  aggs: {
    birthyear: uniques,
    bucketyear: uniques,
    deathyear: uniques,
    id: uniques,
    langs: a => Math.max(...a),
    logyear: uniques,
    occupation_id: uniques
  },

  axisConfig: {
    barConfig: {
      "stroke": "#D6D6D0",
      "stroke-width": 1
    },
    gridConfig: {
      "stroke": "#D6D6D0",
      "stroke-width": 1
    },
    shapeConfig: {
      fill: "#D6D6D0",
      labelConfig: {
        fontColor: "#9E978D",
        fontFamily: () => "Amiko",
        fontSize: () => 10
      },
      stroke: "#D6D6D0"
    },
    tickFormat: d => FORMATTERS.year(new Date(d).getFullYear()),
    tickSize: 5,
    title: false
  },

  backConfig: {
    fontColor: "#000",
    fontFamily: "Amiko",
    fontSize: 14,
    fontWeight: 400,
    text: "« Back"
  },

  depth: 0,
  height: 600,

  legendConfig: {
    shapeConfig: {
      labelConfig: {
        fontColor: "#4B4A48",
        fontFamily: () => "Amiko",
        fontResize: false,
        fontSize: () => 13
      },
      height: () => 18,
      labelPadding: 0,
      width: () => 18
    }
  },

  ocean: false,
  point: d => d.place_coord,
  pointSize: d => d.id instanceof Array ? d.id.length : 1,
  pointSizeMax: 35,
  pointSizeMin: 8,

  shapeConfig: {
    labelConfig: {
      fontColor: (d, i) => ["#fff", "rgba(255, 255, 255, 0.45)"][d.l],
      fontFamily: () => "Amiko",
      textAnchor: "start"
    }
  },

  sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0,
  tiles: false,
  timeFilter: () => true,

  timelineConfig: {
    handleConfig: {
      fill: "#718D9A",
      rx: 6,
      ry: 6
    },
    handleSize: 12,
    tickFormat: d => {
      d = new Date(d);
      return d.getMonth() ? false : FORMATTERS.year(d.getFullYear());
    },
    selectionConfig: {
      "fill": "#718D9A",
      "fill-opacity": 1,
      "stroke-width": 0
    },
    shapeConfig: {
      fill: "#9E978D",
      fontColor: "#9E978D",
      fontFamily: () => "Amiko",
      fontSize: () => 12,
      height: 6,
      stroke: "#9E978D"
    }
  },

  titleConfig: {
    fontColor: "#000",
    fontFamily: "Amiko",
    fontSize: 17,
    fontWeight: 400
  },

  topojson,

  tooltipConfig: {
    background: "#f4f4f1",
    border: "1px solid #d0c9b4",
    footerStyle: {
      "color": "#AFAAA4",
      "font-size": "9px",
      "font-weight": 400,
      "margin": "0 7px 9px",
      "letter-spacing": "0.35px",
      "text-align": "center",
      "text-transform": "uppercase"
    },
    padding: 0,
    titleStyle: {
      "background-color": "#4b4a48",
      "color": "#F4F4F1",
      "font-size": "11px",
      "font-weight": 400,
      "letter-spacing": "1px",
      "max-width": "225px",
      "padding": "8px 7px 7px",
      "text-transform": "uppercase"
    },
    width: "225px"
  },

  xConfig: {
    barConfig: {
      "stroke": "#D6D6D0",
      "stroke-width": 1
    },
    gridConfig: {
      "stroke-width": 0
    },
    shapeConfig: {
      fill: "#D6D6D0",
      labelConfig: {
        fontColor: "#9E978D",
        fontFamily: () => "Amiko",
        fontSize: () => 10
      },
      stroke: "#D6D6D0"
    },
    tickFormat: d => FORMATTERS.year(new Date(d).getFullYear()),
    tickSize: 5,
    title: false
  },

  yConfig: {
    barConfig: {
      "stroke": "#9E978D",
      "stroke-width": 0
    },
    gridConfig: {
      stroke: "#D6D6D0"
    },
    shapeConfig: {
      fill: "#D6D6D0",
      labelConfig: {
        fontColor: "#9E978D",
        fontFamily: () => "Amiko",
        fontSize: () => 10
      },
      stroke: "#D6D6D0"
    },
    tickFormat: d => d % 1 ? "" : FORMATTERS.commas(d),
    tickSize: 5,
    title: "Globally Memorable Individuals",
    titleConfig: {
      fontColor: "#9E978D",
      fontFamily: () => "Amiko",
      fontSize: () => 11
    }
  },

  zoom: false

};
