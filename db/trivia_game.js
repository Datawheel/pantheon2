module.exports = function (sequelize, db) {
  return sequelize.define(
    "trivia_game",
    {
      id: {
        type: db.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: db.STRING,
      },
      game_number: {
        type: db.INTEGER,
      },
      game_share_id: {
        type: db.INTEGER,
      },
      questions: {
        type: db.JSON,
      },
      createdAt: {
        field: "created_at",
        type: db.DATE,
      },
    },
    {
      updatedAt: false,
      freezeTableName: true,
      schema: "trivia",
      tableName: "trivia_game",
    }
  );
};
