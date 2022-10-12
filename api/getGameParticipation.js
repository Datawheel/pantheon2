module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getGameParticipation", async(req, res) => {
        
        const {user_id} = req.body;

        const game_participation = await db.game_participation.findAll({where: {"user_id": user_id}});
        res.status(200).json(game_participation);

    });
  
  };
  


