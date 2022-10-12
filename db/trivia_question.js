module.exports = function(sequelize, db) {

    return sequelize.define("trivia_question",
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