/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
*/
module.exports = {
  db: [
    {
      connection: process.env.PANTHEON_PGURI,
      tables: [
        require("./db/consent.js"),
        require("./db/game_participation.js"),
        require("./db/game.js"),
        require("./db/participant.js"),
        require("./db/trivia_game.js"),
        require("./db/trivia_score.js"),
      ],
    },
  ],
};
