
const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

    const {db} = app.settings;

    app.get("/api/validate", async(req, res) => {
        
        const {user_id} = req.body;

        const participant = (await db.participant.findAll({where: {"user_id": user_id}})).map(item => item.toJSON());
        res.json({participant});

    });
  
  };


  
  