import { FORMATTERS } from "types";

export default {
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
