module.exports = function (sequelize, db) {
  return sequelize.define(
    "consent",
    {
      id: {
        type: db.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        allowNull: false,
        type: db.UUID,
      },
      ip_hash: {
        allowNull: false,
        type: db.STRING,
      },
      universe: {
        type: db.STRING,
      },
      locale: {
        type: db.STRING,
      },
      url: {
        type: db.STRING,
      },
      score_bot: {
        allowNull: false,
        type: db.FLOAT,
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
      tableName: "consent",
    }
  );
};
