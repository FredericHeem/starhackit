import bcrypt from "bcryptjs";

export default function hashPasswordHook(instance) {
  const password = instance.get("password");
    return new Promise((resolve, reject) => {
      if (!instance.changed("password") || !password) {
        return resolve();
      }

      bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
          console.error("hashPasswordHook ", err);
          return reject(err);
        }
        instance.password = password;
        instance.passwordHash = hash;
        resolve();
      });
    });
  };