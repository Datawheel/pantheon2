const hmacSHA512 = require("crypto-js/hmac-sha512");
const {REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getParticipant", async(req, res) => {
        
        const {user_id} = req.body;

        const participant = await db.participant.findAll({where: {"user_id": user_id}});
        res.status(200).json(participant);


    });
  
  };