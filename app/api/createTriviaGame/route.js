const hmacSHA512 = require("crypto-js/hmac-sha512");
const { REACT_APP_GAME_SECRET_KEY } = process.env;
const axios = require("axios");
import prisma from "../../../db/prisma";

export async function POST(request) {
  // Parse the request body
  const body = await request.json(); // res now contains body
  const { date, game_number, game_share_id, questions } = body;

  const trivia_game = await prisma.triviaGame.create({
    data: {
      date: date,
      game_number: game_number,
      game_share_id: game_share_id,
      questions: questions,
    },
  });

  return Response.json({ success: true });
}
