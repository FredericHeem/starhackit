var assert = require('assert')
var Promise = require('bluebird');

module.exports = function (app) {
  "use strict";
  var log = app.log.get(__filename);
  var Sequelize = require('sequelize');
  var sequelize = app.data.sequelize;
  var models = sequelize.models;
  assert(models);
  
  var UserGroup = sequelize.define('userGroup', {
    id: { 
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },{
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
    return models.group.findByName(groupName)
    .then(function(group) {
      if (!group) {
        var err = app.error.format('GroupNotFound',groupName);
        throw err;
      }
      return UserGroup.upsert({
        groupId: group.dataValues.id,
        userId: userId
      },{transaction:t});
    });
  }
  
  return UserGroup;
};