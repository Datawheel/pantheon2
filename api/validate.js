
const {PANTHEON_PGURI} = process.env;

const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: PANTHEON_PGURI 
  // e.g. postgres://user:password@host:5432/database
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
  
  