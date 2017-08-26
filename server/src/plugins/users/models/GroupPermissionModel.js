let log = require('logfilename')(__filename);
let _ = require('lodash');

module.exports = function(sequelize/*, DataTypes*/) {
  const models = sequelize.models;
  const GroupPermission = sequelize.define('GroupPermission', {},
    {
      tableName:"group_permissions",
      underscored: true,
      timestamps: false
    }
  );

  GroupPermission.seedDefault = async function() {
    let groupPermissionsJson = require('./fixtures/group_permission.json');
    log.debug('seedDefault: ', JSON.stringify(groupPermissionsJson, null, 4));
    //console.log('creating all groupPermissions:',groupsPermissions)
    for (let groupName of _.keys(groupPermissionsJson)) {
      await GroupPermission.add(groupName, groupPermissionsJson[groupName]);
    }
  };
  /**
   * Creates in the db all the groupPermissions within permissionsNames associated with the groupName
   *
   * @param {String} groupName  - Name of the group for which we want to add permissions
   * @param {Array} permissionsNames - Array of permissions names linked with the group
   *
   * @returns {Promise} returns a list of Promises results
   */
  GroupPermission.add = async function(groupName, permissionsNames) {
      log.debug(`add: group ${groupName}, permissionsNames ${permissionsNames}`);
      let group = await models.Group.findByName(groupName);
      if (!group)  {
        let err = {name: 'GroupNotFound', message: groupName};
        throw err;
      };
      for (let permission of permissionsNames) {
        log.debug(`check permission: ${permission}`);
        let permissionFound = await models.Permission.findByName(permission);
        if (!permissionFound) {
          log.debug("PermissionNotFound");
          let err = {name: 'PermissionNotFound', message: permission};
          throw err;
        }
        log.debug(`add: groupId: ${group.get().id}, permissionsId: ${permissionFound.get().id}`);

        await GroupPermission.create({
          group_id: group.get().id,
          permission_id: permissionFound.get().id
        });
      };
    };

  return GroupPermission;
};
