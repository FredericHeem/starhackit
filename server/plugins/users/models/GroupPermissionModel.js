module.exports = function (app) {
  "use strict";
  var Sequelize = require('sequelize');
  var Promise = require('bluebird');
  var _ = require('underscore-node');
  
  var sequelize = app.data.sequelize;
  var models = sequelize.models;
  
  var log = app.log.get(__filename);
  
  var GroupPermission = sequelize.define('groupPermission', {
    id: { 
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    tableName: "group_permissions",
    classMethods: {
       add: add,
       seedDefault:seedDefault
    }
  });


  /**
   * Creates in the db all the groups permissions provided in groupsPermissions
   *
   * @param {Object} groupsPermissions  - 
   * Object { "GroupName1":['Permission1','Permission2',"GroupName2":['Permission3']}
   *
   * @returns {Promise} returns a list of Promises results
   */
   
  function seedDefault() {
    var groupPermissionsJson = require('../fixtures/group_permission.json');
    log.debug('seedDefault: ', JSON.stringify(groupPermissionsJson, null, 4));
    //console.log('creating all groupPermissions:',groupsPermissions)
    return Promise.each(_.keys(groupPermissionsJson),function(groupName) {
      return add(groupName,groupPermissionsJson[groupName]);
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
  function add(groupName,permissionsNames) {
    log.debug("add: group %s, permissionsNames %s", groupName, permissionsNames);
    return models.group.findByName(groupName)
    .then(function(group) {    
      if (!group)  {
        var err = app.error.format('GroupNotFound',groupName);
        throw err;
      }
      log.debug("found group ", group.get());
      return Promise.map(permissionsNames, function(permission) {
        log.debug("check permission", permission);
        return models.permission.findByName(permission)
        .then(function(permissionFound){
          if (!permissionFound) {
            log.debug("PermissionNotFound");
            var err = app.error.format('PermissionNotFound',permission);
            throw err;
          }
          log.debug("add: groupId %s, permissionsId %s", group.get().id, permissionFound.get().id);
          return GroupPermission.upsert({
            groupId: group.get().id,
            permissionId: permissionFound.get().id
          });
        });
      }, {"concurrency": 1});
    });
  }

  
  return GroupPermission;
};