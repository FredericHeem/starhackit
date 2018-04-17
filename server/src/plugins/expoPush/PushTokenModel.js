module.exports = function(sequelize, DataTypes) {
  const PushToken = sequelize.define(
    "PushToken",
    {
      token: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true
      }
    },
    {
      tableName: "push_token",
      underscored: true
    }
  );
  PushToken.associate = function(models) {
    PushToken.belongsTo(models.User, {
      as: "user",
      foreignKey: {
        name: "user_id",
        allowNull: false
      }
    });
    models.User.hasMany(models.PushToken, {
      as: "push_token",
      foreignKey: {
        name: "user_id",
        allowNull: true
      }
    });
  };
  return PushToken;
};
