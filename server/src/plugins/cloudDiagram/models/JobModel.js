module.exports = (sequelize, DataTypes) => {
  let Job = sequelize.define(
    "Job",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      kind: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      options: DataTypes.JSONB,
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      result: DataTypes.JSONB,
      error: DataTypes.JSONB,
    },
    {
      tableName: "job",
    }
  );

  Job.associate = (models) => {
    // Job - Infra
    Job.belongsTo(models.Infra, {
      as: "infra",
      onDelete: "CASCADE",
      foreignKey: {
        name: "infra_id",
        allowNull: false,
      },
    });

    models.Infra.hasMany(models.Job, {
      foreignKey: {
        name: "infra_id",
        allowNull: true,
      },
    });

    // Job - User
    Job.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
    });

    models.User.hasMany(models.Job, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
      },
    });
  };
  return Job;
};
