import {getBornOnThisDayImageResponse} from "../../utils";
import {NextResponse} from "next/server";

export const runtime = "edge";

export async function GET(request, context) {
  // In Next.js 14.2+, params may need to be awaited
  const params = await context.params;
  const {locale, date} = params || {};
  try {
    return await getBornOnThisDayImageResponse({date, locale});
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
