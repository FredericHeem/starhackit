'use strict';
var assert = require('assert');
var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
  var log = require('logfilename')(__filename);
  var models = sequelize.models;
  assert(models);

  var UserGroup = sequelize.define('UserGroup', {
    name: DataTypes.TEXT
  }, {
    tableName:"user_groups",
    classMethods: {
      addUserIdInGroup:addUserIdInGroup,
      addUserIdInGroups:addUserIdInGroups
    }
  });

  /**
    * Creates in the db userGroup association between groupname and userId
    * @param {Array} groups  - Name of the group for which we want to add the user
    * @param {String} userId   -   userId to be added to the group   *
    * @returns {Promise} returns a  Promise containing the results of the upsert
    */
   function addUserIdInGroups(groups,userId,t) {
     log.debug("addUserIdInGroup user:%s, #group:", userId, groups.length);
     return Promise.each(groups, function(group){
       return UserGroup.addUserIdInGroup(group, userId, t);
     });
   }
   /**
    * Creates in the db userGroup association between groupname and userId
    * @param {String} groupName  - Name of the group for which we want to add the user
    * @param {String} userId   -   userId to be added to the group   *
    * @returns {Promise} returns a  Promise containing the results of the upsert
    */
   function addUserIdInGroup(groupName,userId,t) {
     log.debug("addUserIdInGroup user:%s, group: %s", userId, groupName);
     return models.Group.findByName(groupName)
     .then(function(group) {
       if (!group) {
         var err = {name: 'GroupNotFound', message: groupName};
         throw err;
       }
       return UserGroup.upsert({
         group_id: group.get().id,
         user_id: userId
       },{transaction:t});
     });
   }

  return UserGroup;
};
