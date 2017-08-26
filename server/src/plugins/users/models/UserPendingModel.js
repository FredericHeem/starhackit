import hashPasswordHook from "./utils/hashPasswordHook";

module.exports = function(sequelize, DataTypes) {
  const UserPending = sequelize.define(
    "UserPending",
    {
      username: DataTypes.STRING(64),
      email: DataTypes.STRING(64),
      password: DataTypes.VIRTUAL,
      passwordHash: DataTypes.STRING,
      code: DataTypes.TEXT(16)
    },
    {
      tableName: "user_pendings",
      hooks: {
        beforeCreate: hashPasswordHook
      }
    }
  );

  return UserPending;
};
