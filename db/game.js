module.exports = function(sequelize, db) {

    return sequelize.define("game",
      {
        id: {
           type: db.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        game_date : {
            type: db.STRING
        },
        game_number : {
            type: db.INTEGER
        },
        sorted_person_1 : {
            type: db.TEXT
        },
        sorted_person_2 : {
            type: db.TEXT
        },
        sorted_person_3 : {
            type: db.TEXT
        },
        sorted_person_4 : {
            type: db.TEXT
        },
        sorted_person_5: {
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
        tableName: "game"
      }
    );
  
  };