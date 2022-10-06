const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;
const axios = require("axios");

module.exports = function(app) {

  const {db} = app.settings;

  app.post('/api/createTriviaQuestion', async function (req, res) {
  
    const {game_id, text, answer_a, answer_b, answer_c, answer_d, correct_answer, token} = req.body;

    const secretKey = process.env.REACT_APP_GAME_RECAPTCHA_SECRET_KEY_V3;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recaptchaV3 = await axios.get(url).then((resp) => resp.data);
    const {success, challenge_ts, hostname, score, action} = recaptchaV3;

    await db.trivia_question.create({"game_id": game_id, "text" :text, "answer_a" :answer_a, "answer_b" :answer_b, "answer_c" :answer_c, "answer_d" :answer_d, "correct_answer" :correct_answer, "score_bot": score}).catch(err => {
      console.error(err);
      res.status(500).json({
        success: false
      });
    });
  });

};


