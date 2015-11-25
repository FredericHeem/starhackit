'use strict';
import bcrypt from "bcrypt";
import Promise from 'bluebird';

module.exports = function(sequelize, DataTypes) {
  let log = require('logfilename')(__filename);
  let models = sequelize.models;

  let User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(64)
    },
    lastName: {
      type: DataTypes.STRING(64)
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
    password: DataTypes.TEXT,
    passwordHash: DataTypes.TEXT
  },
   {
     tableName: "users",
      classMethods: {
         seedDefault: async function () {
          let usersJson = require('./fixtures/users.json');
          log.debug('seedDefault: ', JSON.stringify(usersJson, null, 4));
          for (let userJson of usersJson) {
            await User.createUserInGroups(userJson, userJson.groups);
          }
        },
        /**
         * Finds a user by its email
         * returns the model of the  user
         *
         * @param {String} email - the user's email address
         *
         * @returns {Promise} Promise user model
        */
        findByEmail: function(email) {
          return this.find({where: { email: email } });
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
        createUserInGroups: async function(userJson, groups) {
          log.debug("createUserInGroups user:%s, group: ", userJson, groups);
          return sequelize.transaction(async function(t) {
            log.info("create user");
            let userCreated = await models.User.create(userJson, {transaction: t});
            await models.UserGroup.addUserIdInGroups(groups, userCreated.get().id, t );
            return userCreated;
          })
          .catch(function (err) {
            log.error('createUserInGroups: rolling back', err);
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
          return this.find({where: { username: userName } });
        },

        /**
         * Checks whether a user is able to perform an action on a resource
         * Equivalent to: select name from permissions p join group_permissions g on p.id=g.permission_id where g.group_id=(select group_id from users where username='aliceab@example.com') AND p.resource='user' and p.create=true;
         * @param {String} userId  - The userId to search
         * @param {String} resource  -The resource name to search
         * @param {String} action  - The action , "create,read,update,delete"
         *
         * @returns {Boolean} True if the user can perform the action on the resource otherwise false
         */

        checkUserPermission: async function(userId,resource,action) {
          log.debug('Checking %s permission for %s on %s',action, userId, resource);
          let where = {
              resource: resource,
          };
          where[action.toUpperCase()] = true;
          let res = await this.find({
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
          });
          let authorized = res ? true: false;
          return authorized;
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
          let me = this;
          return new Promise(function(resolve, reject){
            let hashPassword = me.get('passwordHash') || '';

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
          let values = this.get({clone: true});
          delete values.password;
          delete values.passwordHash;
          delete values.createdAt;
          delete values.updatedAt;
          return values;
        }
      }
  },
  {
    underscored: true
  });

  let hashPasswordHook = function(instance, options, done) {
    if (!instance.changed('password')) { return done(); }
    bcrypt.hash(instance.get('password'), 10, function (err, hash) {
      if (err) { return done(err); }
      instance.set('password');
      instance.set('passwordHash', hash);
      done();
    });
  };

  User.beforeCreate(hashPasswordHook);
  User.beforeUpdate(hashPasswordHook);

  return User;
};
