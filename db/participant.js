module.exports = function (sequelize, db) {
  return sequelize.define(
    "participant",
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
      country_id: {
        type: db.INTEGER,
      },
      location_id: {
        type: db.INTEGER,
      },
      age_id: {
        type: db.INTEGER,
      },
      sex_id: {
        type: db.INTEGER,
      },
      language_ids: {
        type: db.JSON,
      },
      education_id: {
        type: db.INTEGER,
      },
      universe: {
        type: db.TEXT,
      },
      locale: {
        type: db.TEXT,
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
      tableName: "participant",
    }
  );
};
