module.exports = (sequelize, DataTypes) => {
  let Infra = sequelize.define(
    "Infra",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      providerType: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      providerAuth: {
        type: DataTypes.JSONB,
      },
      options: DataTypes.JSONB,
    },
    {
      tableName: "infra",
    }
  );

  Infra.associate = (models) => {
    // Infra <-> User
    Infra.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
    });
    models.User.hasMany(models.Infra, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
      },
    });
  };
  return Infra;
};
