
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
        ]
        }
      ]
  };
