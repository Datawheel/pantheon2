import prisma from "../../../db/prisma";

export async function POST(request) {
  // Parse the request body
  const body = await request.json(); // res now contains body
  const { user_id } = body;

  const participant = await prisma.participant.findMany({
    where: {
      user_id: user_id,
    },
  });

  return Response.json(participant);
}
