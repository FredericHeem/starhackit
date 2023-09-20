const assert = require("assert");
const { pipe, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const nanoid = require("nanoid");

const { hashPassword } = require("utils/hashPassword");
const { insert, findOne } = require("utils/SqlOps");

module.exports = () => {
  const getByKey = (key, value) =>
    `
  SELECT user_id,
      email,
      user_type,
      biography,
      created_at,
      updated_at,
      password_hash,
      password_reset_token,
      password_reset_date
  FROM users
  WHERE ${key} = '${value}';`;

  const buildWhere = (search) => `WHERE (email LIKE '%${search}%')`;

  const tableName = "users";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ user_id: `user-${nanoid.nanoid(10)}` }),
        assign({ out: identity, query: insert({ tableName }) }),
      ])(),
    updatePassword: ({ user_id, password }) =>
      pipe([
        () => password,
        hashPassword,
        (password_hash) =>
          `UPDATE ${tableName} SET password_hash = '${password_hash}' WHERE user_id='${user_id}';`,
      ])(),
    getById: ({ user_id }) => getByKey("user_id", user_id),
    getByEmail: ({ email }) => getByKey("email", email),
    getByPasswordResetToken: ({ password_reset_token }) =>
      pipe([
        () => ({
          attributes: ["user_id", "password_reset_date"],
          where: { password_reset_token },
        }),
        findOne({ tableName }),
      ])(),
    count: ({ search } = {}) => `
      SELECT count(*) AS "count"
      FROM ${tableName}
      ${search ? buildWhere(search) : ""};`,
    findAll: ({ limit = 100, offset = 0, order = "DESC", search }) => `
SELECT 
  user_id,
  user_type,
  email,
  first_name,
  last_name,
  picture,
  created_at,
  updated_at
FROM users
${search ? buildWhere(search) : ""}
ORDER BY created_at ${order}
LIMIT ${limit} OFFSET ${offset}
`,
  };
};
