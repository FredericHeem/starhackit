module.exports = (sequelize, DataTypes) => {
  let GitCredential = sequelize.define(
    "GitCredential",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      providerType: {
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
    },
    {
      tableName: "git_credential",
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
