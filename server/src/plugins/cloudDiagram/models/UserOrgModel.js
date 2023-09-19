module.exports = (sequelize, DataTypes) => {
  let user_org = sequelize.define(
    "user_org",
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      org_id: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "user_orgs",
      timestamps: false,
    }
  );

  user_org.associate = (models) => {
    models.User.belongsToMany(models.org, {
      through: user_org,
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
      as: "orgs",
    });
    models.org.belongsToMany(models.User, {
      through: user_org,
      foreignKey: {
        name: "org_id",
        allowNull: false,
      },
      as: "users",
    });
  };

  return user_org;
};
