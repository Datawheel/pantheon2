const hmacSHA512 = require("crypto-js/hmac-sha512");
const {REACT_APP_GAME_SECRET_KEY} = process.env;
const axios = require("axios");

module.exports = function(app) {

  const {db} = app.settings;

  app.post('/api/createGameParticipation', async function (req, res) {
  
    const {game_share_id, trials, solved, user_id, level, token, scoreDB} = req.body;
    const publicIpV4 = req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress ||
          null;
    const ip_hash = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();
    if (scoreDB > -1){

      await db.game_participation.create({"user_id": user_id, "ip_hash" :ip_hash, "game_share_id": game_share_id, "trials": trials, "solved": solved, "level": level, "universe": 0, "score_bot": scoreDB}).catch(err => {
        console.error(err);
        res.status(500).json({
          success: false
        });
      });

    }else {

      
      const secretKey = process.env.REACT_APP_GAME_RECAPTCHA_SECRET_KEY_V3;
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
      const recaptchaV3 = await axios.get(url).then((resp) => resp.data);
      const {success, challenge_ts, hostname, score, action} = recaptchaV3;

      await db.game_participation.create({"user_id": user_id, "ip_hash" :ip_hash, "game_share_id": game_share_id, "trials": trials, "solved": solved, "level": level, "universe": 0, "score_bot": score}).catch(err => {
        console.error(err);
        res.status(500).json({
          success: false
        });
      });

    }

    res.status(200).json({
      success: true
    });
    
  });

};

