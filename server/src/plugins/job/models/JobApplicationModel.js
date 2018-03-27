module.exports = function(sequelize, DataTypes) {
  const JobApplication = sequelize.define(
    "JobApplication",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      message: DataTypes.TEXT
    },
    {
      tableName: "job_application",
      underscored: true
    }
  );
  JobApplication.associate = function(models) {
    JobApplication.belongsTo(models.Job, {
      foreignKey: {
        name: "job_id",
        allowNull: false
      }
    });
    models.Job.hasMany(models.JobApplication, {
      as: "job_applications",
      foreignKey: {
        name: "job_id",
        allowNull: true
      }
    });
    JobApplication.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
        allowNull: false
      }
    });
  };
  return JobApplication;
};
