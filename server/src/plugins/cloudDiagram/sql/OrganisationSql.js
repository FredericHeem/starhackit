const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { defaultsDeep, identity } = require("rubico/x");
const nanoid = require("nanoid");
const { insert, buildUpdateSet } = require("utils/SqlOps");

module.exports = () => {
  const tableName = "org";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ org_id: `org-${nanoid.nanoid(8)}` }),
        fork({ out: identity, query: insert({ tableName }) }),
      ])(),
    update: ({ data, where: { org_id, user_id } }) =>
      pipe([
        tap((param) => {
          assert(data);
          assert(org_id);
          assert(user_id);
        }),
        () =>
          `
          UPDATE ${tableName}
          SET ${buildUpdateSet(data)}
          WHERE org_id IN (
                  SELECT org_id
                  FROM user_orgs
                  WHERE user_id = '${user_id}' AND org_id = '${org_id}'
              );
          `,
      ])(),
    destroy: ({ where: { org_id, user_id } }) =>
      pipe([
        tap((param) => {
          assert(org_id);
          assert(user_id);
        }),
        () =>
          `
          DELETE from ${tableName}
          WHERE org_id IN (
                  SELECT org_id
                  FROM user_orgs
                  WHERE user_id = '${user_id}' AND org_id = '${org_id}'
              );
          `,
      ])(),
    getAllByUser: ({ user_id }) => `
    SELECT ${tableName}.org_id,
      name
      FROM ${tableName}
      INNER JOIN (
          user_orgs
          INNER JOIN users ON users.user_id = user_orgs.user_id
      ) ON ${tableName}.org_id = user_orgs.org_id
      AND users.user_id = '${user_id}';`,
    addUser: ({ org_id, user_id }) =>
      `INSERT INTO user_orgs (org_id, user_id) VALUES ('${org_id}','${user_id}');`,
  };
};
