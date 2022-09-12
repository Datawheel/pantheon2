// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");
const hmacSHA512 = require("crypto-js/hmac-sha512");
const {REACT_APP_GAME_DB_USER, REACT_APP_GAME_DB_HOST, REACT_APP_GAME_DB_NAME,REACT_APP_GAME_DB_PASSWORD, REACT_APP_GAME_DB_PORT} = process.env;

const Pool = require("pg").Pool;
const pool = new Pool({
user: REACT_APP_GAME_DB_USER,
host: REACT_APP_GAME_DB_HOST,
database: REACT_APP_GAME_DB_NAME,
password: REACT_APP_GAME_DB_PASSWORD,
port: REACT_APP_GAME_DB_PORT
});

const {REACT_APP_GAME_SECRET_KEY} = process.env;

module.exports = function(app) {

  app.post('/api/getParticipant', async function (req, res) {

  const {user_id} = req.body;

  const publicIpV4 = req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      null;

  const hashIp = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();

  pool.query(
      "SELECT * FROM participant WHERE user_id = $1 AND ip_hash= $2;", 
    [user_id, hashIp], 
      (error, result) => {
        if (error) {
          return res.status(404).json({message: error});
        };
        return res.status(200).json(result.rows);
      });

  });

}
  
