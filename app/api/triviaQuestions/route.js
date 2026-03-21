import {generateQuestions} from "/lib/trivia/generators";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const mode = searchParams.get("mode") || "daily";
  const count = Math.min(parseInt(searchParams.get("count") || "10", 10), 20);
  const difficulty = searchParams.get("difficulty") || "mixed";

  try {
    const questions = await generateQuestions({mode, count, difficulty});

    if (!questions || questions.length === 0) {
      return Response.json(
        {error: "Failed to generate questions"},
        {status: 500}
      );
    }

    // Strip correct answers for client (prevent cheating via network tab)
    // Actually, we need correct answers client-side for immediate feedback.
    // The old system sent correct_answer too, so this is consistent.
    return Response.json(questions);
  } catch (err) {
    console.error("[triviaQuestions] Error generating questions:", err);
    return Response.json(
      {error: "Internal server error"},
      {status: 500}
    );
  }
}
