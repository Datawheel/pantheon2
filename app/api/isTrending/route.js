import {isTrending} from "/libs/isTrending";

export async function GET(request) {
  const {searchParams} = new URL(request.url);

  const slug = searchParams.get("slug");
  if (!slug) return Response.json([]);

  /////////////////////////
  // 2nd: If not found, check if trending on Wikimedia
  /////////////////////////
  try {
    const isTrendingResult = await isTrending(slug);

    // === 6) Construct the final response ===
    // Did we find the page on any of the past 3 days?
    if (!isTrendingResult) {
      // Not found on any day
      return Response.json({
        isTrending: false,
        message: `${slug} was NOT in the top 1000 for the past 3 days (inclusive).`,
        details: [],
      });
    }

    return Response.json({
      isTrending: true,
      message: `${slug} was in the top 1000 for the past 3 days (inclusive).`,
      details: [],
    });
  } catch (error) {
    console.error("Error in /api/isTrending:", error);
    return Response.json({error: "Internal server error."}, {status: 500});
  }
}
