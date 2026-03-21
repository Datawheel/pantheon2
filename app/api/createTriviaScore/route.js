const hmacSHA512 = require("crypto-js/hmac-sha512");
const {REACT_APP_GAME_SECRET_KEY} = process.env;
import prisma from "../../../db/prisma";

export async function POST(request) {
  const body = await request.json();
  const {user_id, game_share_id, answer} = body;
  const publicIpV4 =
    request.headers["x-forwarded-for"] || request.socket?.remoteAddress || null;
  const ip_hash = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();

  const data = {
    user_id,
    ip_hash,
    game_share_id,
    q_id: answer.qid,
    question_id: answer.quid,
    current_answer_option: answer.ao,
    current_answer: answer.at,
    correct_answer_option: answer.cao,
  };

  await prisma.triviaScore.create({data});

  return Response.json({success: true});
}
