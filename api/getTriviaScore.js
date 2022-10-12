const hmacSHA512 = require("crypto-js/hmac-sha512");
const {REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getTriviaScore", async(req, res) => {
        
        const {user_id, question_id, answer} = req.body;

        const publicIpV4 = req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            null;

        const ip_hash = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();

        const trivia_score = await db.trivia_score.findAll({where: {"user_id": user_id, "ip_hash" :ip_hash, "question_id": question_id, "answer": answer}});
        res.status(200).json(trivia_score);


    });
  
  };