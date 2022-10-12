const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;
const axios = require("axios");

module.exports = function(app) {

  const {db} = app.settings;

  app.post('/api/createTriviaGame', async function (req, res) {
  
    const {date, game_number, game_share_id, questions} = req.body;

    await db.trivia_game.create({"date": date, "game_number" :game_number, "game_share_id" :game_share_id, questions: questions}).catch(err => {
      console.error(err);
      res.status(500).json({
        success: false
      });
    });
  });

};


