module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getConsent", async(req, res) => {
        
        const {user_id} = req.body;

        const consent = await db.consent.findAll({where: {"user_id": user_id}});
        res.status(200).json(consent);
    });
  
  };
  
