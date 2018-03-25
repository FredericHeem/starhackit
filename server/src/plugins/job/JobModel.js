module.exports = function(sequelize, DataTypes) {
  const Job = sequelize.define(
    "Job",
    {
      title: DataTypes.TEXT,
      description: DataTypes.TEXT,
      company_name: DataTypes.TEXT,
      company_url: DataTypes.TEXT,
      company_info: DataTypes.TEXT,
      business_type: DataTypes.TEXT,
      company_logo_url: DataTypes.TEXT,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      sector: DataTypes.TEXT,
      location: DataTypes.JSONB,
      meta: DataTypes.JSONB,
      geo: DataTypes.GEOGRAPHY,
      picture: {
        type: DataTypes.JSONB,
        defaultValue: {}
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
    },
    {
      tableName: "job",
      underscored: true,
      indexes: [
        {
          using: "gist",
          fields: ["geo"]
        },
        {
          fields: ["sector"]
        }
      ]
    }
  );
  Job.associate = function(models) {
    Job.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
        allowNull: false
      }
    });
    models.User.hasMany(models.Job, {
      foreignKey: {
        name: "user_id",
        allowNull: true
      }
    });
  };
  return Job;
};
