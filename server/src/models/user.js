'use strict';
var bcrypt = require("bcrypt");
var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
  var log = require('logfilename')(__filename);
  var models = sequelize.models;

  var User = sequelize.define('User', {
    username: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false
    },
    facebookId: {
      type: DataTypes.TEXT,
      unique: true
    },
    githubId: {
      type: DataTypes.TEXT,
      unique: true
    },
    twitterId: {
      type: DataTypes.TEXT,
      unique: true
    },
    googleId: {
      type: DataTypes.TEXT,
      unique: true
    },
    password: DataTypes.TEXT
  },
   {
     tableName: "users",
      classMethods: {
        seedDefault: function () {
          var usersJson = require('./fixtures/users.json');
          log.debug('seedDefault: ', JSON.stringify(usersJson, null, 4));
          return Promise.each(usersJson, function(userJson){
            return User.createUserInGroups(userJson, userJson.groups);
          });
        },

        /**
         * Finds a user by userid
         * returns the model of the  user
         *
         * @param {String} userid - userid of the user to find
         *
         * @returns {Promise} Promise user model
        */
        findByUserId: function(userid) {
          return this.find({where: { id: userid } });
        },
        /**
         * Creates a user given a json representation and adds it to the group GroupName,
         * returns the model of the created user
         *
         * @param {Object} userJson  -   User in json format
         * @param {Array} groups - the groups to add the user in
         *
         * @returns {Promise}  Promise user created model
         */
        createUserInGroups: function(userJson, groups) {
          log.debug("createUserInGroups user:%s, group: ", userJson, groups);
          return sequelize.transaction(function(t) {
            log.info("create user");
            return models.User.create(userJson, {transaction: t})
            .then(function(userCreated) {
              //console.log("create user in group ", groupName)
              //console.log(userCreated.dataValues.id)
              return models.UserGroup.addUserIdInGroups(groups,userCreated.get().id, t )
              .then(function() {
                return userCreated;
              });
            });
          })
          .then(function (result) {
            // Transaction has been committed
            // result is whatever the result of the promise chain returned to the transaction callback
            return result;
          })
          .catch(function (err) {
            // Transaction has been rolled back
            // err is whatever rejected the promise chain returned to the transaction callback
            log.error('Error during user creation, rolling back', err);
            throw err;
          });
        },

        /**
         * Finds a user by username
         * returns the model of the  user
         *
         * @param {String} userName - Username of the user to find
         *
         * @returns {Promise} Promise user model
         */
        findByUsername: function  findByUsername(userName) {
          return this.find({where: { "username": userName } });
        },

        /**
         * Checks whether a user is able to perform an action on a resource
         * Equivalent to: select name from permissions p join group_permissions g on p.id=g.permission_id where g.group_id=(select group_id from users where username='aliceab@example.com') AND p.resource='user' and p.create=true;
         * @param {Object} app  - The application
         * @param {String} userId  - The userId to search
         * @param {String} resource  -The resource name to search
         * @param {String} action  - The action , "create,read,update,delete"
         *
         * @returns {Boolean} True if the user can perform the action on the resource otherwise false
         */

        checkUserPermission: function(userId,resource,action) {
          log.debug('Checking %s permission for %s on %s',action, userId, resource);
          var where = {
              resource: resource,
          };
          where[action.toLowerCase()] = true;
          return this.find({
            include: [
                      {
                      model: models.Group,
                      include:[
                        {
                         model: models.Permission,
                         where: where
                         }]
                      }],
            where: {
                id: userId
              }
          }).then(function(res) {
           // //console.log(res)
           // console.log(res.dataValues.groups[0].dataValues.permissions)
            if (!res) {return  Promise.resolve(false);}
            return  Promise.resolve(true);
          });
        },

        /**
         * Returns all permissions associated with a user
         *
         * @param {String} username - The username to search permissions for
         *
         * @returns {Promise} a Promise containing array of permission results
         */
        getPermissions: function (username) {
          return this.find({
            include: [
                      {
                      model: models.Group,
                      include:[
                        {
                         model: models.Permission
                        }]
                      }],
            where: {
                username: username
              }
          });
        }
      },

      instanceMethods: {
        comparePassword : function(candidatePassword) {
          var me = this;
          return new Promise(function(resolve, reject){
            var hashPassword = me.get('password') || '';

            bcrypt.compare(candidatePassword, hashPassword, function(err, isMatch) {
              if(err) {return reject(err); }
              resolve(isMatch);
            });
          });
        },

        /**
         * Removes password from the toJson
         *
         */
          toJSON: function () {
          var values = this.get({clone: true});
          delete values.password;
          return values;
        }
      }
  },
  {
    underscored: true
  });

  var hashPasswordHook = function(instance, options, done) {
    if (!instance.changed('password')) { return done(); }
    bcrypt.hash(instance.get('password'), 10, function (err, hash) {
      if (err) { return done(err); }
      instance.set('password', hash);
      done();
    });
  };

  User.beforeValidate(hashPasswordHook);
  User.beforeUpdate(hashPasswordHook);

  return User;
};
