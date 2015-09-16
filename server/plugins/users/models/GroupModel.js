var Promise = require('bluebird');
var assert = require('assert');

module.exports = function (app) {
  "use strict";
  assert(app && app.data && app.data.sequelize);
  
  var log = require('logfilename')(__filename);
  
  var Sequelize = require('sequelize');
  var sequelize = app.data.sequelize;
  var models = sequelize.models;
  
  var Group = sequelize.define('group', {
    id: { 
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: Sequelize.STRING,
      unique:true 
    },
    description: { 
      type: Sequelize.STRING 
    }
  }, {
    classMethods: {
      seedDefault:seedDefault,
      findByName: findByName,
      getPermissions: getPermissions,
      associate: function(models) {
        models.user.belongsToMany(Group,{ "through" : models.userGroup, foreignKey: "userId" });
        Group.belongsToMany(models.permission,{ "through" : models.groupPermission, foreignKey: "groupId"});
        Group.belongsToMany(models.user,{ "through" : models.userGroup, foreignKey: "groupId"   });
      }
    }
  });

  function seedDefault() {
    var groupsJson = require('../fixtures/groups.json');
    log.debug('seedDefault: ', JSON.stringify(groupsJson, null, 4));
    return app.data.utils.upsertRows(Group,groupsJson);
  }

  function findByName(groupName) {
    return models.group.find({where: { "name": groupName } });
  }
  
  /**
   * Returns all the  permission associated with a group 
   *
   * @param {String} groupName  - The name of the group to search
   * @returns {Promise}  a Promise containing permission results
   */
  function getPermissions(groupName) {
    return models.group.find({     
      include:[
        {
         model: models.permission   
      }],
      where:{
         name: groupName
      }
      });
  }
  
  return Group;
};