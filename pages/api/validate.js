module.exports = function (app) {
  const {db} = app.settings;

  app.get("/api/validate", async (req, res) => {
    const {user_id} = req.body;

    const participant = (await db.participant.findAll({where: {user_id}})).map(
      item => item.toJSON()
    );
    res.json(participant);
  });
};
