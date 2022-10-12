const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

    const {db} = app.settings;

    app.get("/api/allTriviaQuestion", async(req, res) => {

        const trivia_question = await db.trivia_question.findAll();
        res.status(200).json(trivia_question);
        
    });
  
  };

  

