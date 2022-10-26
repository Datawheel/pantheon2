module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getTriviaGame", async(req, res) => {
        
        const {date, game_share_id} = req.body;

        const trivia_game = await db.trivia_game.findAll({where: {"date": date, "game_share_id" :game_share_id}});
        res.status(200).json(trivia_game);

    });
  
  };

  


