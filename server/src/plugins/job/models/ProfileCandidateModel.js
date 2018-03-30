import createFakeCandidateProfile from "../test/createFakeCandidateProfile";

module.exports = function(sequelize, DataTypes) {
  const ProfileCandidate = sequelize.define(
    "ProfileCandidate",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
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

  ProfileCandidate.seedDefault = async function(models) {
    const users = await models.User.findAll();
    const fakeProfiles = users.map(user =>
      createFakeCandidateProfile({ user_id: user.get().id })
    );
    return ProfileCandidate.bulkCreate(fakeProfiles);
  };

  return ProfileCandidate;
};
