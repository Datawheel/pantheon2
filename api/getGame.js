const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

    const {db} = app.settings;

    app.get("/api/getGame", async(req, res) => {
        
        const {game_date, game_number} = req.body;

        const game = (await db.game.findAll({where: {"game_date": game_date, "game_number" :game_number}})).map(item => item.toJSON());
        res.json({game});

    });
  
  };

  
