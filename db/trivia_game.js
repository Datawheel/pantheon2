module.exports = function(sequelize, db) {

    return sequelize.define("trivia_game",
      {
        id: {
          type: db.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date : {
            type: db.STRING
        },
        game_number : {
            type: db.INTEGER
        },
        score_bot: {
            allowNull: false,
            type: db.FLOAT
        },
        createdAt: {
          field: 'created_at',
          type: db.DATE,
      },
      },
      {
        updatedAt: false,
        freezeTableName: true,
        tableName: "trivia_game"
      }
    );
  
  };