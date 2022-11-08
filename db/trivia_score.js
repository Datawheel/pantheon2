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
        game_share_id : {
            type: db.INTEGER
        },
        q_id : {
            type: db.INTEGER
        },
        question_id : {
            type: db.INTEGER
        },
        current_answer_option : {
          type: db.STRING
        },
        current_answer : {
          type: db.STRING
        },
        correct_answer_option : {
          type: db.STRING
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