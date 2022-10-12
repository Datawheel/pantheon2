const hmacSHA512 = require("crypto-js/hmac-sha512");

module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getTriviaQuestion", async(req, res) => {
        
        const {text, game_id} = req.body;

        const trivia_question = await db.trivia_question.findAll({where: {"text": text, "game_id" :game_id}});
        res.status(200).json(trivia_question);


    });
  
  };

  

