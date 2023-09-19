module.exports = (sequelize, DataTypes) => {
  let GitCredential = sequelize.define(
    "GitCredential",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      provider_type: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
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
      tableName: "git_credential",
      timestamps: false,
    }
  );

  GitCredential.associate = (models) => {
    // GitCredential <-> User
    GitCredential.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
    });
    models.User.hasMany(models.GitCredential, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
      },
    });
  };
  return GitCredential;
};
