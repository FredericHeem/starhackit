module.exports = function(sequelize, DataTypes) {
  const AuthProvider = sequelize.define(
    "AuthProvider",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      authId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "auth_provider",
      timestamps: false
    }
  );

  AuthProvider.associate = function(models) {
    models.User.hasMany(models.AuthProvider, {
      foreignKey: "user_id",
      as: "auth_provider"
    });
    models.AuthProvider.belongsTo(models.User, {
      foreignKey: "user_id"
    });
  };

  return AuthProvider;
};
