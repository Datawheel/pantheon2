import {FORMATTERS} from "types";

function uniques(a) {
  const v = Array.from(new Set(a));
  return v.length === 1 ? v[0] : v;
}

export default {
  timeFilter: () => true,
  height: 600,

  aggs: {
    birthyear: uniques,
    deathyear: uniques,
    id: uniques,
    occupation_id: uniques
  },

  axisConfig: {
    barConfig: {stroke: "#9E978D"},
    gridConfig: {"stroke-width": 0},
    shapeConfig: {
      fill: "#9E978D",
      fontColor: "#9E978D",
      fontFamily: () => "Amiko",
      fontSize: () => 10,
      stroke: "#9E978D"
    },
    tickFormat: d => FORMATTERS.year(new Date(d).getFullYear()),
    tickSize: 5,
    title: false
  },

  legendConfig: {
    shapeConfig: {
      fontColor: "#4B4A48",
      fontFamily: () => "Amiko",
      fontResize: false,
      fontSize: () => 14,
      height: () => 18,
      labelPadding: 0,
      width: () => 18
    }
  },

  shapeConfig: {
    fontColor: ["#fff", "rgba(255, 255, 255, 0.45)"],
    fontFamily: () => "Amiko",
    textAnchor: "start"
  },

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
      "padding": "8px 7px 7px",
      "text-transform": "uppercase"
    },
    width: "225px"
  },

  xConfig: {
    barConfig: {stroke: "#9E978D"},
    gridConfig: {"stroke-width": 0},
    shapeConfig: {
      fill: "#9E978D",
      fontColor: "#9E978D",
      fontFamily: () => "Amiko",
      fontSize: () => 10,
      stroke: "#9E978D"
    },
    tickFormat: d => FORMATTERS.year(new Date(d).getFullYear()),
    tickSize: 5,
    title: false
  },

  yConfig: {
    barConfig: {"stroke-width": 0},
    gridConfig: {"stroke-width": 0},
    labels: [],
    ticks: [],
    title: false
  }
};
