
module.exports = function(app) {

  const {db} = app.settings;

  app.post('/api/createTriviaQuestion', async function (req, res) {
  
    const {game_id, text, answer_a, answer_b, answer_c, answer_d, correct_answer} = req.body;

    await db.trivia_question.create({"game_id": game_id, "text" :text, "answer_a" :answer_a, "answer_b" :answer_b, "answer_c" :answer_c, "answer_d" :answer_d, "correct_answer" :correct_answer}).catch(err => {
      console.error(err);
      res.status(500).json({
        success: false
      });
    });
  });

};


