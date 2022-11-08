const axios = require("axios");

module.exports = function(app) {

  const {db} = app.settings;

  app.post('/api/createGame', async function (req, res) {
  
  const {game_date, game_number, sorted_person_1, sorted_person_2, sorted_person_3, sorted_person_4, sorted_person_5} = req.body;
  
  await db.game.create({"game_date": game_date, "game_number" :game_number, "sorted_person_1": sorted_person_1, "sorted_person_2": sorted_person_2, "sorted_person_3": sorted_person_3, "sorted_person_4": sorted_person_4, "sorted_person_5": sorted_person_5}).catch(err => {
    console.error(err);
    res.status(500).json({
      success: false
    });
  });

  res.status(200).json({
    success: true
  });
  
});

};

