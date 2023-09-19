const { pipe } = require("rubico");
const nanoid = require("nanoid");

const { hashPassword } = require("utils/hashPassword");

module.exports = () => {
  return {
    insert: ({ email, password }) =>
      pipe([
        () => password,
        hashPassword,
        (password_hash) =>
          `INSERT INTO user_pending (email, password_hash, code) VALUES ('${email}','${password_hash}', '${nanoid.nanoid(
            16
          )}');`,
      ])(),
    deleteByEmail: ({ email }) =>
      `DELETE FROM user_pending WHERE email='${email}'`,
    getByEmail: ({ email }) => `
    SELECT email, code
    FROM user_pending
    WHERE email = '${email}';`,
    getByCode: ({ code }) => `
    SELECT email,
        code, password_hash, created_at
    FROM user_pending
    WHERE code = '${code}';`,
  };
};
