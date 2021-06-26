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
      providerName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      providerAuth: {
        type: DataTypes.JSONB,
      },
      project: DataTypes.JSONB,
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
      as: "user",
    });
    models.User.hasMany(models.Infra, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
      },
    });

    // Infra has one GitCredential
    Infra.belongsTo(models.GitCredential, {
      foreignKey: {
        name: "git_credential_id",
        allowNull: true,
      },
      as: "gitCredential",
    });

    // Infra has one GitRepository
    Infra.belongsTo(models.GitRepository, {
      foreignKey: {
        name: "git_repository_id",
        allowNull: true,
      },
      as: "gitRepository",
    });
  };
  return Infra;
};
