const { map, pipe, tap } = require("rubico");
const nanoid = require("nanoid");

const { hashPassword } = require("utils/hashPassword");

module.exports = () => {
  const getByKey = (key, value) =>
    `
  SELECT id,
      email,
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
    insert: ({ user_id = `user-${nanoid.nanoid(10)}`, email, password_hash }) =>
      `INSERT INTO ${tableName} (id, email, password_hash) VALUES ('${user_id}','${email}', '${password_hash}');`,
    delete: ({ user_id }) => `DELETE FROM ${tableName} WHERE id='${user_id}';`,
    // update: ({ user_id, payload }) =>
    //   `UPDATE users SET ${buildUpdateSet(payload)}' WHERE id='${user_id}';`,
    updatePassword: ({ user_id, password }) =>
      pipe([
        () => password,
        hashPassword,
        (password_hash) =>
          `UPDATE ${tableName} SET password_hash = '${password_hash}' WHERE id='${user_id}';`,
      ])(),
    updateToken: ({
      user_id,
      password_reset_token,
      password_reset_date = new Date().toISOString(),
    }) =>
      `UPDATE ${tableName} SET password_reset_token = '${password_reset_token}', password_reset_date = '${password_reset_date}' WHERE id='${user_id}';`,
    //TODO to user_id
    getById: ({ user_id }) => getByKey("id", user_id),
    getByEmail: ({ email }) => getByKey("email", email),
    getByPasswordResetToken: ({ password_reset_token }) =>
      getByKey("password_reset_token", password_reset_token),

    count: ({ search } = {}) => `
      SELECT count(*) AS "count"
      FROM ${tableName}
      ${search ? buildWhere(search) : ""};`,
    findAll: ({ limit = 100, offset = 0, order = "DESC", search }) => `
SELECT 
  id,
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
