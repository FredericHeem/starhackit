module.exports = function(sequelize, DataTypes) {
  const log = require("logfilename")(__filename);

  const Permission = sequelize.define(
    "Permission",
    {
      name: DataTypes.TEXT,
      resource: DataTypes.TEXT,
      description: DataTypes.TEXT,
      POST: DataTypes.BOOLEAN,
      GET: DataTypes.BOOLEAN,
      PUT: DataTypes.BOOLEAN,
      PATCH: DataTypes.BOOLEAN,
      DELETE: DataTypes.BOOLEAN
    },
    {
      tableName: "permissions",
      underscored: true,
      timestamps: false
    }
  );

  Permission.associate = function(models) {
    Permission.belongsToMany(models.Group, {
      through: models.GroupPermission,
      foreignKey: "permission_id"
    });
  };

  Permission.seedDefault = function() {
    let permissionsJson = require("./fixtures/permissions.json");
    log.debug("seedDefault: ", JSON.stringify(permissionsJson, null, 4));
    return Permission.bulkCreate(permissionsJson);
  };

  Permission.findByName = function(permissionName) {
    return Permission.find({ where: { name: permissionName } });
  };

  return Permission;
};
