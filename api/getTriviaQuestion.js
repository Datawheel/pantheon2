const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

    const {db} = app.settings;

    app.get("/api/getTriviaQuestion", async(req, res) => {
        
        const {text, game_id} = req.body;


        const trivia_question = (await db.trivia_question.findAll({where: {"text": text, "game_id" :game_id}})).map(item => item.toJSON());
        res.json({trivia_question});

    });
  
  };

  

