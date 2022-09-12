
const {REACT_APP_GAME_DB_USER, REACT_APP_GAME_DB_HOST, REACT_APP_GAME_DB_NAME, REACT_APP_GAME_DB_PASSWORD, REACT_APP_GAME_DB_PORT} = process.env;

const Pool = require("pg").Pool;
const pool = new Pool({
user: REACT_APP_GAME_DB_USER,
host: REACT_APP_GAME_DB_HOST,
database: REACT_APP_GAME_DB_NAME,
password: REACT_APP_GAME_DB_PASSWORD,
port: REACT_APP_GAME_DB_PORT
});


module.exports = function(app) {

  app.get('/api/validate', async function (req, res) {

  const {user_id} = req.body;

  pool.query(
    "SELECT * FROM participant WHERE user_id = $1;", 
    [user_id], 
    (error, result) => {
      if (error) throw error;
      const data = result.rows;
      return res.status(200).json(data);
    });


  });

}
  
  