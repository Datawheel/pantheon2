const hmacSHA512 = require("crypto-js/hmac-sha512");
const {REACT_APP_GAME_SECRET_KEY} = process.env;
const axios = require("axios");
import prisma from "../../../db/prisma";

export async function POST(request) {
  // Parse the request body
  const body = await request.json(); // res now contains body
  const {
    lang,
    location_id,
    education_id,
    country_id,
    age_id,
    sex_id,
    languages,
    user_id,
    token,
    universe,
    scoreDB,
  } = body;
  const publicIpV4 =
    request.headers["x-forwarded-for"] || request.socket?.remoteAddress || null;
  const ip_hash = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();

  if (scoreDB > -1) {
    await prisma.participant.create({
      data: {
        user_id,
        ip_hash,
        sex_id: `${sex_id}`,
        country_id,
        location_id: `${location_id}`,
        age_id,
        language_ids: JSON.stringify(languages),
        education_id,
        locale: lang,
        universe,
        score_bot: scoreDB,
      },
    });
  } else {
    const secretKey = process.env.REACT_APP_GAME_RECAPTCHA_SECRET_KEY_V3;
    const Recap_url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recaptchaV3 = await axios.get(Recap_url).then(resp => resp.data);

    // const {success, challenge_ts, hostname, score, action} = recaptchaV3;
    const {score} = recaptchaV3;
    await prisma.participant.create({
      data: {
        user_id,
        ip_hash,
        sex_id: `${sex_id}`,
        country_id,
        location_id: `${location_id}`,
        age_id,
        language_ids: JSON.stringify(languages),
        education_id,
        locale: lang,
        universe,
        score_bot: score,
      },
    });
  }
  return Response.json({success: true});
}
