module.exports = (sequelize, DataTypes) => {
  let org = sequelize.define(
    "org",
    {
      org_id: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      options: DataTypes.JSONB,
    },
    {
      tableName: "org",
    }
  );
  // const orgsResult = await org.findAll({
  //   include: [
  //     {
  //       model: models.User,
  //       as: "users",
  //       where: {
  //         id: user_id,
  //       },
  //       attributes: ["email", "username"],
  //       required: true,
  //     },
  //   ],
  // });
  return org;
};
