import {getBornOnThisDayImageResponse} from "../../utils";

export const runtime = "edge";

export async function GET(request, context) {
  // In Next.js 14.2+, params may need to be awaited
  const params = await context.params;
  const {locale, date} = params || {};
  return getBornOnThisDayImageResponse({date, locale});
}
