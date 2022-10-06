const hmacSHA512 = require("crypto-js/hmac-sha512");
const {PANTHEON_PGURI,REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

    const {db} = app.settings;

    app.get("/api/participant", async(req, res) => {
        
        const {user_id} = req.body;

        const publicIpV4 = req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            null;

        const ip_hash = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();

        const participant = (await db.participant.findAll({where: {"user_id": user_id, "ip_hash" :ip_hash}})).map(item => item.toJSON());
        res.json({participant});

    });
  
  };