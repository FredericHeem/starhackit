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
      provider_type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      provider_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      provider_auth: {
        type: DataTypes.JSONB,
      },
      project: DataTypes.JSONB,
      options: DataTypes.JSONB,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
    },
    {
      tableName: "infra",
      timestamps: false,
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
