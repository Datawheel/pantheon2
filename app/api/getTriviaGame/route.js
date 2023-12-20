import prisma from "../../../db/prisma";

export async function POST(request) {
  // Parse the request body
  const body = await request.json(); // res now contains body
  const { date, game_share_id } = body;

  const triviaGame = await prisma.TriviaGame.findMany({
    where: { date: date, game_share_id: game_share_id },
  });
  return Response.json(triviaGame);
}
