const bcrypt = require("bcryptjs");

exports.hashPassword = (password) =>
  new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        console.error("hashPasswordHook ", err);
        reject(err);
      } else {
        resolve(hash);
      }
    })
  );

exports.comparePassword = ({ password, password_hash }) =>
  new Promise((resolve, reject) =>
    bcrypt.compare(password, password_hash, (err, isMatch) =>
      err ? reject(err) : resolve(isMatch)
    )
  );
