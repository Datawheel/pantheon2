const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;
const axios = require("axios");

module.exports = function(app) {

  const {db} = app.settings;

  app.post('/api/createTriviaGame', async function (req, res) {
  
    const {date, game_number, token} = req.body;

    const secretKey = process.env.REACT_APP_GAME_RECAPTCHA_SECRET_KEY_V3;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recaptchaV3 = await axios.get(url).then((resp) => resp.data);
    const {success, challenge_ts, hostname, score, action} = recaptchaV3;

    await db.trivia_game.create({"date": date, "game_number" :game_number, "score_bot": score}).catch(err => {
      console.error(err);
      res.status(500).json({
        success: false
      });
    });
  });

};


