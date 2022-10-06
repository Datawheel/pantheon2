
/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
*/
module.exports = {
    db: [
        {
          connection: process.env.CANON_DB_CONNECTION1,
          tables: [
            
            require("./db/consent.js"),
            require("./db/game_participation.js"),
            require("./db/game.js"),
            require("./db/participant.js"),
            require("./db/trivia_game.js"),
            require("./db/trivia_question.js"),
            require("./db/trivia_score.js")
            // require("./api/createConsent.js"),
            // require("./api/createGame.js"),
            // require("./api/createGameParticipation.js"),
            // require("./api/createParticipant.js"),
            // require("./api/createTriviaGame.js"),
            // require("./api/createTriviaQuestion.js"),
            // require("./api/createTriviaScore.js"),
            // require("./api/getConsent.js"),
            // require("./api/getGame.js"),
            // require("./api/getGameParticipation.js"),
            // require("./api/getParticipant.js"),
            // require("./api/getTriviaGame.js"),
            // require("./api/getTriviaQuestion.js")
        ]
        }
      ]
  };
