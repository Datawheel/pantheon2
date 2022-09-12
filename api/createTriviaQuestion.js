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

module.exports = function(app) {

  app.post('/api/createTriviaQuestion', async function (req, res) {

    const {game_id, text, answer_a, answer_b, answer_c, answer_d, correct_answer} = req.body;

    pool.query(
      "INSERT INTO trivia_question (game_id, text, answer_a, answer_b, answer_c, answer_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
      [game_id, text, answer_a, answer_b, answer_c, answer_d, correct_answer], 
      (error, result) => {
        if (error) {
          console.log(error);
          return res.status(404).json({message: "error"});
        };
        return res.status(200).json({message: "ok"});
      });

  })
}
  