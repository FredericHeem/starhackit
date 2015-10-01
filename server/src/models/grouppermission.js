'use strict';
module.exports = function(sequelize/*, DataTypes*/) {
  var log = require('logfilename')(__filename);
  var Promise = require('bluebird');
  var _ = require('underscore');
  var models = sequelize.models;
  var GroupPermission = sequelize.define('GroupPermission', {},
  {
    tableName:"group_permissions",
    classMethods: {
        add: add,
        seedDefault:seedDefault
      }
  });

  function seedDefault() {
    var groupPermissionsJson = require('./fixtures/group_permission.json');
    log.debug('seedDefault: ', JSON.stringify(groupPermissionsJson, null, 4));
    //console.log('creating all groupPermissions:',groupsPermissions)
    return Promise.each(_.keys(groupPermissionsJson), function(groupName) {
      return add(groupName, groupPermissionsJson[groupName]);
    });
  }
  /**
   * Creates in the db all the groupPermissions within permissionsNames associated with the groupName
   *
   * @param {String} groupName  - Name of the group for which we want to add permissions
   * @param {Array} permissionsNames - Array of permissions names linked with the group
   *
   * @returns {Promise} returns a list of Promises results
   */
  function add(groupName, permissionsNames) {
      log.debug("add: group %s, permissionsNames ", groupName, permissionsNames);
      return models.Group.findByName(groupName)
      .then(function(group) {
        if (!group)  {
          var err = {name: 'GroupNotFound', message: groupName};
          throw err;
        }
        log.debug("found group ", group.get());
        return Promise.map(permissionsNames, function(permission) {
          log.debug("check permission", permission);
          return models.Permission.findByName(permission)
          .then(function(permissionFound) {
            if (!permissionFound) {
              log.debug("PermissionNotFound");
              var err = {name: 'PermissionNotFound', message: permission};
              throw err;
            }
            log.debug("add: groupId %s, permissionsId %s", group.get().id, permissionFound.get().id);
            return GroupPermission.create({
              group_id: group.get().id,
              permission_id: permissionFound.get().id
            });
          });
        }, {"concurrency": 1});
      });
    }

  return GroupPermission;
};
