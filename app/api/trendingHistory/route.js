import {NextResponse} from "next/server";

const BASE_API = process.env.BASE_API || "http://localhost:3100";

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const slug = searchParams.get("slug");
  const lang = searchParams.get("lang") || "en";

  if (!slug) {
    return NextResponse.json({error: "slug is required"}, {status: 400});
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = `${currentYear - 1}-01-01`;

  try {
    // Fetch trending entries and news reasons in parallel
    const [trendRes, newsRes] = await Promise.all([
      fetch(
        `${BASE_API}/trend?slug=eq.${slug}&lang=eq.${lang}&date=gte.${startDate}&select=date,rank_pantheon&order=date.asc`,
        {next: {revalidate: 3600}},
      ),
      fetch(
        `${BASE_API}/trend_news?slug=eq.${slug}&lang=eq.${lang}&date=gte.${startDate}&select=date,reason,llm_provider&order=date.asc`,
        {next: {revalidate: 3600}},
      ),
    ]);

    if (!trendRes.ok) {
      return NextResponse.json({error: "Failed to fetch trending data"}, {status: 500});
    }

    const trendData = await trendRes.json();
    const newsData = newsRes.ok ? await newsRes.json() : [];

    // Build a map of date -> best reason (prefer perplexity > claude > others)
    const providerPriority = ["perplexity", "claude", "grok", "gemini", "openai"];
    const reasonMap = {};
    for (const entry of newsData) {
      if (!entry.reason || !entry.date) continue;
      const existing = reasonMap[entry.date];
      if (!existing) {
        reasonMap[entry.date] = entry.reason;
      } else {
        const existingIdx = providerPriority.indexOf(existing.provider);
        const newIdx = providerPriority.indexOf(entry.llm_provider);
        if (newIdx >= 0 && (existingIdx < 0 || newIdx < existingIdx)) {
          reasonMap[entry.date] = entry.reason;
        }
      }
    }

    // Merge reasons into trend data
    const merged = trendData.map(entry => ({
      ...entry,
      reason: reasonMap[entry.date] || null,
    }));

    return NextResponse.json(merged);
  } catch (e) {
    console.error("trendingHistory error:", e);
    return NextResponse.json({error: e.message}, {status: 500});
  }
}
