"use strict";
module.exports = function(sequelize, DataTypes) {
  let log = require("logfilename")(__filename);

  let Group = sequelize.define(
    "Group",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "groups",
      underscored: true,
      timestamps: false
    }
  );



  Group.associate = function(models) {
    models.User.belongsToMany(Group, {
      through: models.UserGroup,
      foreignKey: "user_id"
    });
    Group.belongsToMany(models.Permission, {
      through: models.GroupPermission,
      foreignKey: "group_id"
    });
    Group.belongsToMany(models.User, {
      through: models.UserGroup,
      foreignKey: "group_id"
    });
  };

  Group.seedDefault = function() {
    let groupsJson = require("./fixtures/groups.json");
    log.debug("seedDefault: ", JSON.stringify(groupsJson, null, 4));
    return Group.bulkCreate(groupsJson);
  };

  let models = sequelize.models;

  Group.findByName = function(groupName) {
    return models.Group.find({ where: { name: groupName } });
  };

  /**
   * Returns all the  permission associated with a group
   *
   * @param {String} groupName  - The name of the group to search
   * @returns {Promise}  a Promise containing permission results
   */
  Group.getPermissions = function(groupName) {
    return models.Group.find({
      include: [
        {
          model: models.Permission
        }
      ],
      where: {
        name: groupName
      }
    });
  };

  return Group;
};
