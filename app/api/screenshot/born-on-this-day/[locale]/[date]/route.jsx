import {getBornOnThisDayImageResponse} from "../../utils";
import {NextResponse} from "next/server";
import {getSupportedLocale} from "../../../helpers/locale";

// Match the hardened person route: the Node runtime has higher memory limits
// and more predictable image decoding than the edge sandbox.
export const runtime = "nodejs";

export async function GET(request, context) {
  // In Next.js 14.2+, params may need to be awaited
  const params = await context.params;
  const {date} = params || {};
  const locale = getSupportedLocale(params?.locale);
  try {
    return await getBornOnThisDayImageResponse({
      date,
      locale,
      requestUrl: request.url,
    });
  } catch (error) {
    console.error(
      "[screenshot-fail]",
      {
        route: "born-on-this-day-locale-date",
        url: request.url,
        date,
        locale,
      },
      error
    );
    return new NextResponse("OG render failed", {status: 500});
  }
}
