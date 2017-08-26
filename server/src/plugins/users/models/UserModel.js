import bcrypt from "bcryptjs";
import Promise from "bluebird";
import hashPasswordHook from './utils/hashPasswordHook';

module.exports = function(sequelize, DataTypes) {
  const log = require("logfilename")(__filename);
  const models = sequelize.models;

  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
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
      password: DataTypes.VIRTUAL,
      passwordHash: DataTypes.TEXT
    },
    {
      tableName: "users",
      underscored: false,
      hooks: {
        beforeCreate: hashPasswordHook,
        beforeUpdate: hashPasswordHook
      }
    }
  );

  User.seedDefault = async function() {
    let usersJson = require("./fixtures/users.json");
    log.debug("seedDefault: ", JSON.stringify(usersJson, null, 4));
    for (let userJson of usersJson) {
      await User.createUserInGroups(userJson, userJson.groups);
    }
  };

  User.findByKey = async function(key, value) {
    return this.find({
      include: [
        {
          model: models.Profile,
          as: "profile",
          attributes: ["biography"]
        },
        {
          model: models.AuthProvider,
          as: "auth_provider",
          attributes: ["name", "authId"]
        }
      ],
      where: { [key]: value }
    });
  };
  User.findByEmail = async function(email) {
    return this.findByKey("email", email);
  };
  User.findByUserId = async function(userid) {
    return this.findByKey("id", userid);
  };

  User.findByUsername = async function(userName) {
    return this.findByKey("username", userName);
  };
  User.findByUsernameOrEmail = async function(username) {
    return this.find({
      where: {
        $or: [{ email: username }, { username: username }]
      }
    });
  };
  User.createUserInGroups = async function(userJson, groups) {
    log.debug("createUserInGroups user:%s, group: ", userJson, groups);
    return sequelize
      .transaction(async function(t) {
        let userCreated = await models.User.create(userJson, {
          transaction: t
        });
        const userId = userCreated.get().id;
        await models.UserGroup.addUserIdInGroups(groups, userId, t);
        //Create the profile
        let profile = await models.Profile.create(
          { ...userJson.profile, user_id: userId },
          { transaction: t }
        );
        log.debug("profile created ", profile.get());
        //Create the eventual authentication provider
        if (userJson.authProvider) {
          await models.AuthProvider.create(
            { ...userJson.authProvider, user_id: userId },
            { transaction: t }
          );
        }
        /*
            sqlite doesn't support this
            await models.UserPending.destroy({
              where: {
                email: userJson.email
              }
            },{transaction: t});
            */
        return userCreated;
      })
      .then(async userCreated => {
        await models.UserPending.destroy({
          where: {
            email: userJson.email
          }
        });
        return userCreated;
      })
      .catch(function(err) {
        log.error("createUserInGroups: rolling back", err);
        throw err;
      });
  };
  User.checkUserPermission = async function(userId, resource, action) {
    log.debug("Checking %s permission for %s on %s", action, userId, resource);
    let where = {
      resource: resource
    };
    where[action.toUpperCase()] = true;
    let res = await this.find({
      include: [
        {
          model: models.Group,
          include: [
            {
              model: models.Permission,
              where: where
            }
          ]
        }
      ],
      where: {
        id: userId
      }
    });
    let authorized = res.Groups.length > 0 ? true : false;
    return authorized;
  };

  User.getPermissions = function(username) {
    return this.find({
      include: [
        {
          model: models.Group,
          include: [
            {
              model: models.Permission
            }
          ]
        }
      ],
      where: {
        username: username
      }
    });
  };

  User.prototype.comparePassword = function(candidatePassword) {
    let me = this;
    return new Promise(function(resolve, reject) {
      let hashPassword = me.get("passwordHash") || "";
      bcrypt.compare(candidatePassword, hashPassword, function(err, isMatch) {
        if (err) {
          return reject(err);
        }
        resolve(isMatch);
      });
    });
  };

  User.prototype.toJSON = function() {
    let values = this.get({ clone: true });
    delete values.passwordHash;
    return values;
  };

  return User;
};
