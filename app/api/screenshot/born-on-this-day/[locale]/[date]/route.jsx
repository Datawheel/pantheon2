import {getBornOnThisDayImageResponse} from "../../utils";

export const runtime = "edge";

export async function GET(request, {params}) {
  const {date, locale} = params || {};
  return getBornOnThisDayImageResponse({date, locale});
}
