/**
 * Checks if a given slug is trending on Wikimedia by verifying
 * its presence in the top 1000 articles over the past three days.
 *
 * @param slug - The article slug to check.
 * @returns Promise<boolean> - Returns true if the slug is trending, otherwise false.
 */
export async function isTrending(slug) {
  if (!slug || typeof slug !== "string") {
    throw new Error("Invalid slug provided.");
  }

  const project = "en.wikipedia";
  const accessType = "all-access";

  /**
   * Returns a date string in Wikimedia's required "YYYY/MM/DD" format,
   * offset by `daysAgo` from today.
   *
   * @param daysAgo - Number of days to subtract from today.
   * @returns string - Formatted date string.
   */
  function getDateString(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  try {
    // === 1) Compute the past 3 dates, including "today" as day 0 ===
    // dayOffsets = [0, 1, 2] → [today, yesterday, 2 days ago]
    const dayOffsets = [0, 1, 2];
    const dateStrings = dayOffsets.map(offset => getDateString(offset));

    // === 2) For each date, build a Wikimedia "top pages" URL ===
    const wikiUrls = dateStrings.map(
      ds =>
        `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${project}/${accessType}/${ds}`
    );

    // === 3) Fetch all 3 days in parallel ===
    const fetchPromises = wikiUrls.map(url => fetch(url));
    const responses = await Promise.all(fetchPromises);

    // === 4) Convert each response to JSON. Some might fail (e.g., data not published yet). ===
    const jsonPromises = responses.map(async res => {
      if (!res.ok) {
        // If a particular day fails (404, 500, etc.), return null so we can skip it
        console.warn(
          `Warning: Failed to fetch data for URL ${res.url} - ${res.statusText}`
        );
        return null;
      }
      const data = await res.json();
      return data;
    });

    // results will be an array of data objects or null
    const results = await Promise.all(jsonPromises);

    // === 5) Search each day's articles to see if slug is in top 1000 ===
    for (const data of results) {
      if (!data || !data.items || !data.items[0] || !data.items[0].articles) {
        // No data for that day
        continue;
      }
      const articles = data.items[0].articles;
      const foundArticle = articles.find(art => art.article === slug);

      if (foundArticle) {
        // Slug found in top 1000
        return true;
      }
    }

    // === 6) Slug not found in top 1000 for the past 3 days ===
    return false;
  } catch (error) {
    console.error("Error in isTrending function:", error);
    // Depending on your use case, you might want to throw the error or return false
    return false;
  }
}
