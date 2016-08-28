'use strict';
import bcrypt from "bcryptjs";
module.exports = function(sequelize, DataTypes) {
  var UserPending = sequelize.define('UserPending', {
    username: DataTypes.STRING(64),
    email: DataTypes.STRING(64),
    password: DataTypes.VIRTUAL,
    passwordHash: DataTypes.STRING,
    code: DataTypes.TEXT(16)
  }, {
    tableName:"user_pendings"
  });

  let hashPasswordHook = function(instance, options, done) {
    if (!instance.changed('password')) { return done(); }
    bcrypt.hash(instance.get('password'), 10, function (err, hash) {
      if (err) { return done(err); }
      instance.set('password', '');
      instance.set('passwordHash', hash);
      done();
    });
  };

  UserPending.beforeValidate(hashPasswordHook);
  UserPending.beforeUpdate(hashPasswordHook);

  return UserPending;
};
