module.exports = function(sequelize, db) {

    return sequelize.define("trivia_score",
      {
        id: {
          type: db.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        game_id : {
            type: db.INTEGER
        },
        text : {
            type: db.TEXT
        },
        answer_a : {
            type: db.TEXT
        },
        answer_b : {
          type: db.TEXT
        },
        answer_c : {
          type: db.TEXT
        },
        answer_d : {
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
        tableName: "trivia_question"
      }
    );
  
  };