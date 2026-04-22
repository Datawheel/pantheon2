import * as echarts from "echarts";
import "echarts/theme/v5";

export const initEChart = (dom, opts) => echarts.init(dom, "v5", opts);

export {echarts};
