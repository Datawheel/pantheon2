// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");
const hmacSHA512 = require("crypto-js/hmac-sha512");
const {REACT_APP_GAME_DB_USER, REACT_APP_GAME_DB_HOST, REACT_APP_GAME_DB_NAME,REACT_APP_GAME_DB_PASSWORD, REACT_APP_GAME_DB_PORT} = process.env;

const Pool = require("pg").Pool;
const pool = new Pool({
user: REACT_APP_GAME_DB_USER,
host: REACT_APP_GAME_DB_HOST,
database: REACT_APP_GAME_DB_NAME,
password: REACT_APP_GAME_DB_PASSWORD,
port: REACT_APP_GAME_DB_PORT
});

const {REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

  app.post('/api/createParticipant', async function (req, res) {

    const {lang, location_id, education_id, country_id, age_id, sex_id, languages, user_id, token, universe} = req.body;

    const secretKey = process.env.REACT_APP_GAME_RECAPTCHA_SECRET_KEY_V3;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recaptchaV3 = await axios.get(url).then((resp) => resp.data);
    const {success, challenge_ts, hostname, score, action} = recaptchaV3;
    console.log("score", score);

    const publicIpV4 = req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      null;
    // const ipData = await axios.get(`http://ip-api.com/json/${publicIpV4}`).then(resp => resp.data);

    const hashIp = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();
    
    pool.query(
      "INSERT INTO participant (user_id, ip_hash, sex_id, country_id, location_id, age_id, language_ids, education_id, locale, universe, score_bot) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
      [user_id, hashIp, sex_id, country_id, location_id, age_id, languages, education_id, lang, universe, score], 
      (error, result) => {
        if (error) {
          console.log(error);
          return res.status(404).json({message: "error"});
        };
        return res.status(200).json({message: "ok"});
      });

  })
}
  