const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;
const axios = require("axios");

module.exports = function(app) {

  const {db} = app.settings;

  app.post('/api/createTriviaScore', async function (req, res) {
  
    const {user_id, game_id, question_id, answer, correct_answer, token} = req.body;
    const publicIpV4 = req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      null;

    const ip_hash = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();

    const secretKey = process.env.REACT_APP_GAME_RECAPTCHA_SECRET_KEY_V3;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recaptchaV3 = await axios.get(url).then((resp) => resp.data);
    const {success, challenge_ts, hostname, score, action} = recaptchaV3;
    
    await db.trivia_score.create({"user_id": user_id, "ip_hash": ip_hash, "game_id" :game_id, "question_id": question_id, "answer": answer, "correct_answer": correct_answer, "score_bot": score}).catch(err => {
      console.error(err);
      res.status(500).json({
        success: false
      });
    });
  });

};




