module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Profile', {
    biography: {
      type: DataTypes.STRING(2048)
    }
  }, {
    tableName: "profile",
    underscored: true,
    timestamps: false,
    classMethods: {
      associate: function (models) {
        models.User.hasOne(models.Profile, {
          foreignKey: 'user_id',
          as: 'profile'
        });
        models.Profile.belongsTo(models.User, {
          foreignKey: 'user_id'
        });

      }
    }
  });
};
