const assert = require("assert");
const { pipe, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const nanoid = require("nanoid");

const { hashPassword } = require("utils/hashPassword");
const { insert, findOne } = require("utils/SqlOps");

module.exports = ({ sql }) => {
  assert(sql);
  const getByKey = (key, value) =>
    sql`
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
  WHERE ${sql(key)} = ${value};`;

  const buildWhere = (search) => sql`WHERE (email LIKE ${"%" + search + "%"})`;

  const tableName = "users";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ user_id: `user-${nanoid.nanoid(10)}` }),
        assign({ out: identity, query: insert({ tableName, sql }) }),
      ])(),
    updatePassword: ({ user_id, password }) =>
      pipe([
        () => password,
        hashPassword,
        (password_hash) =>
          sql`UPDATE ${sql(
            tableName
          )} SET password_hash = ${password_hash} WHERE user_id=${user_id};`,
      ])(),
    getById: ({ user_id }) => getByKey("user_id", user_id),
    getByEmail: ({ email }) => getByKey("email", email),
    getByPasswordResetToken: ({ password_reset_token }) =>
      pipe([
        () => ({
          attributes: ["user_id", "password_reset_date"],
          where: { password_reset_token },
        }),
        findOne({ tableName, sql }),
      ])(),
    count: ({ search } = {}) => sql`
      SELECT count(*) AS "count"
      FROM ${sql(tableName)}
      ${search ? buildWhere(search) : sql``};`,
    findAll: ({ limit = 100, offset = 0, order = "DESC", search }) => sql`
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
${search ? buildWhere(search) : sql``}
ORDER BY created_at ${order === "DESC" ? sql`DESC` : sql`ASC`}
LIMIT ${limit} OFFSET ${offset}
`,
  };
};
