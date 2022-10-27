const axios = require("axios");

module.exports = function(app) {

  const {db} = app.settings;

  app.post('/api/createGame', async function (req, res) {
  
  const {game_date, game_number, sorted_person_1, sorted_person_2, sorted_person_3, sorted_person_4, sorted_person_5, token} = req.body;
  
  const secretKey = process.env.REACT_APP_GAME_RECAPTCHA_SECRET_KEY_V3;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  const recaptchaV3 = await axios.get(url).then((resp) => resp.data);
  const {success, challenge_ts, hostname, score, action} = recaptchaV3;
  
  await db.game.create({"game_date": game_date, "game_number" :game_number, "sorted_person_1": sorted_person_1, "sorted_person_2": sorted_person_2, "sorted_person_3": sorted_person_3, "sorted_person_4": sorted_person_4, "sorted_person_5": sorted_person_5, "score_bot": score}).catch(err => {
    // console.error(err);
    res.status(500).json({
      success: false
    });
  });
});

};

