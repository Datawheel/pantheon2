module.exports = function(sequelize, db) {

    return sequelize.define("game_participation",
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
        universe: {
            type: db.STRING
        },
        game_id : {
            type: db.INTEGER
        },
        trials : {
            type: db.STRING
        },
        solved : {
            type: db.INTEGER
        },
        level : {
            type: db.INTEGER
        },
        score_bot: {
            allowNull: false,
            type: db.FLOAT
        },
        createdAt: {
          field: 'created_at',
          type: db.DATE,
      }
      },
      {
        updatedAt: false,
        freezeTableName: true,
        tableName: "game_participant"
      }
    );
  
  };