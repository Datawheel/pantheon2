module.exports = function(sequelize, db) {

    return sequelize.define("trivia_score",
      {
        id: {
            type: db.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
          allowNull: false,
          type: db.UUID
        },
        ip_hash: {
            allowNull: false,
            type: db.STRING
        },
        game_id : {
            type: db.INTEGER
        },
        question_id : {
            type: db.INTEGER
        },
        answer : {
            type: db.TEXT
        },
        correct_answer : {
          type: db.TEXT
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
        tableName: "trivia_score"
      }
    );
  
  };