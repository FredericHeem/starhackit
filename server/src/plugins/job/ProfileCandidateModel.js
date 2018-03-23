module.exports = function(sequelize, DataTypes) {
  const ProfileCandidate = sequelize.define(
    "ProfileCandidate",
    {
      summary: {
        type: DataTypes.STRING(2048)
      },
      experiences: {
        type: DataTypes.JSONB
      },
      location: {
        type: DataTypes.JSONB
      },
      sectors: {
        type: DataTypes.JSONB
      },
      geo: DataTypes.GEOGRAPHY
    },
    {
      tableName: "profile_candidate",
      underscored: true,
      timestamps: false,
      indexes: [
        {
          using: "gist",
          fields: ["geo"]
        },
        {
          using: "gin",
          fields: ["sectors"]
        }
      ]
    }
  );

  ProfileCandidate.associate = function(models) {
    models.User.hasOne(models.ProfileCandidate, {
      foreignKey: "user_id",
      as: "profile_candidate"
    });
    models.ProfileCandidate.belongsTo(models.User, {
      foreignKey: "user_id"
    });
  };
  return ProfileCandidate;
};
