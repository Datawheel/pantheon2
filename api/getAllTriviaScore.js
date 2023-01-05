
function convertTZ(date, tzString) {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
    );
  }

function consecutiveGames(array) {
    let counter = 0;
    for (let i = 0; i < (array.length-1); i++) {
        if ((array[i] + 1) === array[i + 1]) {
            counter++;
        } else {
            return counter;
        }
    }
   return counter;
}

function maxConsecutiveGames(array) {
    let maxCounter = 0;
    let counter = 0;
    for (let i = 0; i < (array.length-1); i++) {
        if ((array[i] + 1) === array[i + 1]) {
            counter++;
        } else {
            if (counter > maxCounter) {
                maxCounter =  counter;
            }
            counter = 0;
        }
    }
    if (counter > maxCounter) {
        return counter;
    }
   return maxCounter;
}

module.exports = function(app) {

    const {db} = app.settings;

    app.post("/api/getAllTriviaScore", async(req, res) => {
        
        const {user_id} = req.body;
        const allScores = await db.trivia_score.findAll({where: {"user_id": user_id}});
        
        var myStatistics = {
            total: 0,
            correct: 0,
            numberDays: 0,
            numberAttempts: 0,
            currentStreak: 0,
            maxStreak: 0,
            numberWins: 0,
            game_ids : [],
            win_game_ids : [],
            games : []
        }

        allScores.sort((a, b) => a.createdAt - b.createdAt);
        
        if (allScores.length > 0) {

            var game_id = 0;
            allScores.forEach((element,index) => {

                myStatistics.total = myStatistics.total + 1;

                if (index === 0) {
                       
                    myStatistics.games[game_id] = {
                        id: game_id,
                        correct: 0,
                        played: 0
                    }

                }else{
                    const difference =
                    +convertTZ(new Date(element.createdAt)) -
                    +convertTZ(new Date(allScores[index-1].createdAt));
                    if (difference > 16000){
                        // differetGame, nextGame
                        game_id = game_id + 1;
                        myStatistics.games[game_id] = {
                            id: game_id,
                            correct: 0,
                            played:0
                        }
                    }
                }

                if (element.current_answer_option === element.correct_answer_option){
                    myStatistics.correct = myStatistics.correct + 1;

                    myStatistics.games[game_id].correct = myStatistics.games[game_id].correct + 1;
                }
                myStatistics.games[game_id].played = myStatistics.games[game_id].played + 1;
                
                myStatistics.game_ids.push(element.game_share_id);
            });

            
            myStatistics.games.forEach((element,index) => {
                if (element.correct >= 10){
                    myStatistics.numberWins = myStatistics.numberWins = 1;
                    myStatistics.win_game_ids.push(element.id);
                }
                if (element.played > 9){
                    myStatistics.numberAttempts = myStatistics.numberAttempts + 1;
                }
                if (myStatistics.games[index].correct === 0){
                    myStatistics.games[index].score = myStatistics.games[index].correct;
                }else{
                    if (myStatistics.games[index].correct > 10){
                        myStatistics.games[index].score = 100;
                    }else{
                        myStatistics.games[index].score = parseInt(100*(myStatistics.games[index].correct/10));
                    }
                    
                }
                
              });
              myStatistics.games.sort((a, b) => b.score - a.score);
              myStatistics.bestScore = myStatistics.games[0].score;
              myStatistics.numberDays = Array.from(new Set(myStatistics.game_ids)).length;

              const gamesU = Array.from(new Set(myStatistics.win_game_ids));
              gamesU.sort((a, b) => b - a);
              myStatistics.currentStreak = consecutiveGames(gamesU);
              myStatistics.maxStreak = maxConsecutiveGames(gamesU)
              
            
          }
          return res.json([myStatistics]);
        
    });
  
  };