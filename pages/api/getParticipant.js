module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getParticipant", async(req, res) => {
        
        const {user_id} = req.body;

        const participant = await db.participant.findAll({where: {"user_id": user_id}});
        res.status(200).json(participant);


    });
  
  };