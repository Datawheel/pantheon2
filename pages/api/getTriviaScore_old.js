module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getTriviaScore", async(req, res) => {
        
        const {user_id, question_id, answer} = req.body;

        const trivia_score = await db.trivia_score.findAll({where: {"user_id": user_id, "question_id": question_id, "answer": answer}});
        res.status(200).json(trivia_score);


    });
  
  };