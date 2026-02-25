import {getBornOnThisDayImageResponse} from "./utils";

export const runtime = "edge";

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const date = searchParams.get("date");
  const locale = searchParams.get("locale") || "en";
  return getBornOnThisDayImageResponse({date, locale});
}
