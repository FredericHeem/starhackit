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
      tableName: "job",
      timestamps: false,
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
      as: "user",
      onDelete: "CASCADE",
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
