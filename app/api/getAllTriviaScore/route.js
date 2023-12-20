import prisma from "../../../db/prisma";

export async function GET() {
  const triviaScores = await prisma.TriviaScore.findMany();
  return Response.json(triviaScores);
}
