module.exports = (sequelize, DataTypes) => {
  let GitRepository = sequelize.define(
    "GitRepository",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      branch: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "main",
      },
      options: DataTypes.JSONB,
    },
    {
      tableName: "git_repository",
    }
  );

  GitRepository.associate = (models) => {
    // GitRepository <-> User
    GitRepository.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
    });
    models.User.hasMany(models.GitRepository, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
      },
    });
  };
  return GitRepository;
};
