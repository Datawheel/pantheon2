const hmacSHA512 = require("crypto-js/hmac-sha512");
const {REACT_APP_GAME_SECRET_KEY} = process.env;
const axios = require("axios");

module.exports = function(app) {

  const {db} = app.settings;

  app.post('/api/createParticipant', async function (req, res) {
  
    const {lang, location_id, education_id, country_id, age_id, sex_id, languages, user_id, token, universe} = req.body;

    const publicIpV4 = req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress ||
          null;
    
    const ip_hash = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();
  
    const secretKey = process.env.REACT_APP_GAME_RECAPTCHA_SECRET_KEY_V3;
    const Recap_url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recaptchaV3 = await axios.get(Recap_url).then((resp) => resp.data);

    const {success, challenge_ts, hostname, score, action} = recaptchaV3;

    const participant = {"user_id": user_id, "ip_hash" :ip_hash, "sex_id": sex_id, "country_id": country_id, "location_id": location_id, "age_id": age_id, "language_ids": languages, "education_id": education_id, "locale": lang, "universe": universe, "score_bot": score};

    await db.participant.create(participant).catch(err => {
      console.error(err);
      res.status(500).json({
        success: false
      });
    });
  });

};





