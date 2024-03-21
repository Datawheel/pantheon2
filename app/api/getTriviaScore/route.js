import prisma from "../../../db/prisma";

export async function POST(request) {
  // Parse the request body
  const body = await request.json(); // res now contains body
  const {user_id, question_id, answer} = body;

  const triviaScore = await prisma.TriviaScore.findMany({
    where: {user_id, question_id, answer},
  });
  return Response.json(triviaScore);
}
