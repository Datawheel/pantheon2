import {getBornOnThisDayImageResponse} from "./utils";
import {NextResponse} from "next/server";
import {getSupportedLocale} from "../helpers/locale";

export const runtime = "edge";

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const date = searchParams.get("date");
  const locale = getSupportedLocale(searchParams.get("locale"));
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
        route: "born-on-this-day",
        url: request.url,
        date,
        locale,
      },
      error
    );
    return new NextResponse("OG render failed", {status: 500});
  }
}
