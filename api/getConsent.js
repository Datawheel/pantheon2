// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");
const hmacSHA512 = require("crypto-js/hmac-sha512");

const {PANTHEON_PGURI, REACT_APP_GAME_SECRET_KEY} = process.env;
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: PANTHEON_PGURI 
  // e.g. postgres://user:password@host:5432/database
 });

module.exports = function(app) {

  app.post('/api/getConsent', async function (req, res) {

  const {user_id} = req.body;

  const publicIpV4 = req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      null;

  const hashIp = hmacSHA512(publicIpV4, REACT_APP_GAME_SECRET_KEY).toString();

  pool.query(
      "SELECT * FROM consent WHERE user_id = $1 AND ip_hash= $2;", 
    [user_id, hashIp], 
      (error, result) => {
        if (error) {
          return res.status(404).json({message: error});
        };
        return res.status(200).json(result.rows);
      });

  });

}
  
