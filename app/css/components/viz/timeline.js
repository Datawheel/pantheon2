import { FORMATTERS } from "types";

export default {
  handleConfig: {
    fill: "#718D9A",
    rx: 6,
    ry: 6
  },
  handleSize: 12,
  tickFormat: d => FORMATTERS.year(new Date(d).getFullYear()),
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
};
