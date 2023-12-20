
module.exports = function(app) {

    const {db} = app.settings;

    app.get("/api/getAllTriviaScore", async(req, res) => {
        
        const get_trivia_score = await db.trivia_score.findAll();
        res.status(200).json(get_trivia_score);
        
    });
  
  };