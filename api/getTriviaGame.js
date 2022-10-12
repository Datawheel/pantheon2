const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getTriviaGame", async(req, res) => {
        
        const {date, game_number} = req.body;

        const trivia_game = await db.trivia_game.findAll({where: {"date": date, "game_number" :game_number}});
        res.status(200).json(trivia_game);

    });
  
  };

  


