const bcrypt = require("bcryptjs");
const Promise = require("bluebird");
const nanoid = require("nanoid");
const Op = require("sequelize").Op;
module.exports = function (sequelize, DataTypes) {
  const log = require("logfilename")(__filename);
  const models = sequelize.models;

  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      user_type: {
        type: DataTypes.TEXT,
      },
      email: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(64),
        field: "first_name",
      },
      last_name: {
        type: DataTypes.STRING(64),
        field: "last_name",
      },
      picture: {
        type: DataTypes.JSONB,
      },
      biography: {
        type: DataTypes.STRING(2048),
      },
      password_reset_token: DataTypes.STRING(32),
      password: DataTypes.VIRTUAL,
      password_hash: {
        type: DataTypes.TEXT,
        field: "password_hash",
      },
      auth_type: DataTypes.TEXT,
      auth_id: DataTypes.TEXT,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
    },
    {
      tableName: "users",
      timestamps: false,
      hooks: {},
    }
  );

  User.seedDefault = async function () {};

  User.findByKey = async function (key, value) {
    return this.findOne({
      where: { [key]: value },
      attributes: [
        "id",
        "user_type",
        "email",
        "username",
        "picture",
        "created_at",
        "updated_at",
      ],
    });
  };
  User.findByEmail = async function (email) {
    return this.findByKey("email", email);
  };
  User.findByUserId = async function (userid) {
    return this.findByKey("id", userid);
  };

  User.findByUsername = async function (userName) {
    return this.findByKey("username", userName);
  };
  User.findByUsernameOrEmail = async function (username) {
    return this.findOne({
      where: {
        [Op.or]: [{ email: username }, { username: username }],
      },
    });
  };
  User.createUserInGroups = async function (userJson, groups) {
    log.debug("createUserInGroups user:%s, group: ", userJson, groups);
    return sequelize
      .transaction(async function (t) {
        const user_id = nanoid.nanoid(10);
        let userCreated = await models.User.create(
          { ...userJson, id: user_id },
          {
            transaction: t,
          }
        );
        return userCreated;
      })
      .then(async (userCreated) => {
        // await models.UserPending.destroy({
        //   where: {
        //     email: userJson.email,
        //   },
        // });
        return userCreated;
      })
      .catch(function (err) {
        log.error("createUserInGroups: rolling back", err);
        throw err;
      });
  };
  User.checkUserPermission = async function (userId, resource, action) {
    log.debug("Checking %s permission for %s on %s", action, userId, resource);
    let where = {
      resource: resource,
    };
    where[action.toUpperCase()] = true;
    let res = await this.findOne({
      include: [
        {
          model: models.Group,
          include: [
            {
              model: models.Permission,
              where: where,
            },
          ],
        },
      ],
      where: {
        id: userId,
      },
    });
    let authorized = res.Groups.length > 0 ? true : false;
    return authorized;
  };

  User.getPermissions = function (username) {
    return this.findOne({
      include: [
        {
          model: models.Group,
          include: [
            {
              model: models.Permission,
            },
          ],
        },
      ],
      where: {
        username: username,
      },
    });
  };

  User.prototype.comparePassword = function (candidatePassword) {
    let me = this;
    return new Promise(function (resolve, reject) {
      let hashPassword = me.get("password_hash") || "";
      bcrypt.compare(candidatePassword, hashPassword, function (err, isMatch) {
        if (err) {
          return reject(err);
        }
        resolve(isMatch);
      });
    });
  };

  User.prototype.toJSON = function () {
    let values = this.get({ clone: true });
    delete values.password_hash;
    return values;
  };

  return User;
};
