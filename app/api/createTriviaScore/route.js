const hmacSHA512 = require("crypto-js/hmac-sha512");
const { REACT_APP_GAME_SECRET_KEY } = process.env;
const axios = require("axios");
import prisma from "../../../db/prisma";

export async function POST(request) {
  // Parse the request body
  const body = await request.json(); // res now contains body
  const { user_id, game_share_id, answer, token, scoreDB } = body;
  const publicIpV4 =
    request.headers["x-forwarded-for"] || request.socket?.remoteAddress || null;
  const ip_hash = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();

  if (scoreDB > -1) {
    const trivia_score = await prisma.triviaScore.create({
      data: {
        user_id: user_id,
        ip_hash: ip_hash,
        game_share_id: game_share_id,
        q_id: answer.qid,
        question_id: answer.quid,
        current_answer_option: answer.ao,
        current_answer: answer.at,
        correct_answer_option: answer.cao,
        score_bot: scoreDB,
      },
    });
  } else {
    const secretKey = process.env.REACT_APP_GAME_RECAPTCHA_SECRET_KEY_V3;
    const Recap_url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recaptchaV3 = await axios.get(Recap_url).then((resp) => resp.data);

    const { success, challenge_ts, hostname, score, action } = recaptchaV3;
    const trivia_score = await prisma.triviaScore.create({
      data: {
        user_id: user_id,
        ip_hash: ip_hash,
        game_share_id: game_share_id,
        q_id: answer.qid,
        question_id: answer.quid,
        current_answer_option: answer.ao,
        current_answer: answer.at,
        correct_answer_option: answer.cao,
        score_bot: score,
      },
    });
  }
  return Response.json({ success: true });
}
