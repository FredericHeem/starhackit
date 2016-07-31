let assert = require('assert');
let log = require('logfilename')(__filename);

module.exports = function(sequelize, DataTypes) {

  let models = sequelize.models;
  assert(models);

  let UserGroup = sequelize.define('UserGroup', {
    name: DataTypes.TEXT
  }, {
    tableName:"user_groups",
    underscored: true,
    timestamps: false,
    classMethods: {
      addUserIdInGroup:addUserIdInGroup,
      addUserIdInGroups:addUserIdInGroups
    }
  });

  /**
    * Creates in the db userGroup association between group name and userId
    * @param {Array} groups  - Name of the group for which we want to add the user
    * @param {String} userId   -   userId to be added to the group   *
    * @returns {Promise} returns a  Promise containing the results of the upsert
    */
   async function addUserIdInGroups(groups, userId, t) {
     log.debug(`addUserIdInGroups user:${userId}, #groups ${groups.length}`);
     for (let group of groups) {
       await UserGroup.addUserIdInGroup(group, userId, t);
     }
   }
   /**
    * Creates in the db userGroup association between groupname and userId
    * @param {String} groupName  - Name of the group for which we want to add the user
    * @param {String} userId   -   userId to be added to the group   *
    * @returns {Promise} returns a  Promise containing the results of the upsert
    */
   async function addUserIdInGroup(groupName, userId, t) {
     log.debug(`addUserIdInGroup user:${userId}, group: ${groupName}`);
     //let group = await models.Group.findByName(groupName);
     let group = await models.Group.find({
       where: { name: groupName }
     }, {transaction:t});
     if (!group) {
       let err = {name: 'GroupNotFound', message: groupName};
       throw err;
     };
     //log.debug(`addUserIdInGroup upsert to user:${userId} group: ${group.get().id}`);
     return UserGroup.upsert({
       group_id: group.get().id,
       user_id: userId
     }, {transaction:t});
   }

  return UserGroup;
};
