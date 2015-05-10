var Promise = require('bluebird');
var assert = require('assert');

module.exports = function (app) {
  "use strict";
  assert(app && app.data && app.data.sequelize);
  
  var log = app.log.get(__filename);
  
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
      getGroupId: getGroupId,
      getGroupPermissions: getGroupPermissions,
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
    return models.group.find({where: { "name": groupName } })
    .then(function(res) {
      if (!res) {
        var err = app.error.format('GroupNotFound',groupName);
        throw err;
      } 
      return res;
    });   
  }
  /**
   * Get group id given groupName
   *
   * @param {String} groupName - groupName of the group to get the group id
   *
   * @returns {Promise} Promise containing group id
  */
   function getGroupId(groupName) {
     return app.models.group.find(
         {
           attributes: [ 'id' ],
           where: 
           { 
             name: groupName 
           } 
         })
         .then(function(res) {
   
           if (!res) {
             var err = app.error.format('GroupNotFound',groupName);
             throw err;
           }
           
           return  Promise.resolve(res.get().id);
         });
   }
  
  /**
   * Returns all the  permission associated with a group 
   *
   * @param {Object} app  - The application
   * @param {String} group  - The name of the group to search
   * @returns {Promise}  a Promise containing permission results
   */
  function getGroupPermissions(group) {
    return models.group.findAll({     
      include:[
        {
         model: models.permission   
      }],
      where:{
         name: group
      }
      });
  }
  
  return Group;
};