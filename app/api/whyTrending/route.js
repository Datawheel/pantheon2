const axios = require("axios");
import {isTrending} from "/libs/isTrending";

export async function GET(request) {
  const {searchParams} = new URL(request.url);

  const slug = searchParams.get("slug");
  if (!slug) return Response.json([]);

  /////////////////////////
  // 1st: Check if we already have the trending reason in our database
  /////////////////////////

  // Get date from 2 days ago for the query
  const date2DaysAgo = new Date();
  date2DaysAgo.setDate(date2DaysAgo.getDate() - 2);
  const year = date2DaysAgo.getFullYear();
  const month = String(date2DaysAgo.getMonth() + 1).padStart(2, "0");
  const day = String(date2DaysAgo.getDate()).padStart(2, "0");
  const date2DaysAgoFormattedDate = `${year}-${month}-${day}`;

  const trendingReasonUrl = `${process.env.BASE_API}/trend_reason?slug=eq.${slug}&date=gte.${date2DaysAgoFormattedDate}`;

  const existingReasonResponse = await fetch(trendingReasonUrl).catch(
    e => (
      console.log("Error fetching trending reason from DB:", e), {ok: false}
    )
  );

  if (existingReasonResponse.ok) {
    const existingReason = await existingReasonResponse.json();
    if (existingReason?.length) {
      // Return the existing reason if found
      return Response.json({
        isTrending: true,
        message: `${slug} trending reason found in db (cached)`,
        reason: existingReason[0].reason,
      });
    }
  }

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

    /////////////////////////
    // 3rd: If they are trending, ask perplexity AI why and save to result to db
    /////////////////////////

    const apiKey =
      process.env.PERPLEXITY_API_KEY ||
      "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";

    const messages = [
      {
        "role": "system",
        "content":
          "You are an artificial intelligence assistant and you need to engage in a helpful, detailed, polite conversation with a user.",
      },
      {
        "role": "user",
        "content": `Why is ${slug.replaceAll("_", " ")} trending today?`,
      },
    ];

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages,
        temperature: 0.2,
        top_p: 0.9,
        search_domain_filter: ["perplexity.ai"],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "month",
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
        response_format: null,
      }),
    };

    const response = await fetch(
      "https://api.perplexity.ai/chat/completions",
      options
    );

    if (!response.ok) {
      console.log(response);
      const errorBody = await response.text();
      return Response.json(
        {
          error: `Perplexity API call failed with status ${response.status}`,
          details: errorBody,
        },
        {status: 500}
      );
    }

    // 4) Return the JSON data from the remote API directly back to the client
    const data = await response.json();

    await axios.post(
      `${process.env.BASE_API}/trend_reason`,
      {
        slug,
        date: date2DaysAgoFormattedDate,
        reason: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization":
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
        },
      }
    );

    // Found on one or more days
    return Response.json({
      isTrending: true,
      message: `${slug} was in the top 1000 on these day(s):`,
      reason: data,
      //   reason: data.choices[0].message.content,
      // e.g. details: [
      //   { date: '2025/01/22', rank: 15, views: 12345 },
      //   { date: '2025/01/20', rank: 987, views: 2345 }
      // ]
    });
  } catch (error) {
    console.error("Error in /api/whyTrending:", error);
    return Response.json({error: "Internal server error."}, {status: 500});
  }
}
