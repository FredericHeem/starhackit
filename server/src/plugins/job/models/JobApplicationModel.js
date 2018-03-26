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
    JobApplication.belongsTo(models.User, {
      as: "applicant",
      foreignKey: {
        name: "user_id",
        allowNull: false
      }
    });
    JobApplication.belongsTo(models.Job, {
      foreignKey: {
        name: "job_id",
        allowNull: false
      }
    });
    models.User.hasMany(models.JobApplication, {
      foreignKey: {
        name: "user_id",
        allowNull: true
      }
    });
  };
  return JobApplication;
};
