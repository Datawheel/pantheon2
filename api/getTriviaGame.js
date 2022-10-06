const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

    const {db} = app.settings;

    app.get("/api/getTriviaGame", async(req, res) => {
        
        const {date, game_number} = req.body;

        const trivia_game = (await db.trivia_game.findAll({where: {"date": date, "game_number" :game_number}})).map(item => item.toJSON());
        res.json({trivia_game});

    });
  
  };

  


