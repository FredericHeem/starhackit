const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { defaultsDeep, identity } = require("rubico/x");
const nanoid = require("nanoid");
const { insert } = require("utils/SqlOps");

module.exports = ({ sql }) => {
  const tableName = "project";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ project_id: `project-${nanoid.nanoid(8)}` }),
        fork({ out: identity, query: insert({ tableName, sql }) }),
      ])(),
    getAllByOrg: ({
      // attributes = ["project_id", "org_id"],
      where: { org_id, user_id },
    }) =>
      pipe([
        tap(() => {
          assert(org_id);
          assert(user_id);
        }),
        () => sql`
      SELECT ${sql(tableName)}.project_name, ${sql(tableName)}.project_id
        FROM ${sql(tableName)}
        INNER JOIN (
            user_orgs
            INNER JOIN users ON users.user_id = user_orgs.user_id
        ) ON ${sql(tableName)}.org_id = user_orgs.org_id
        AND users.user_id = ${user_id};`,
      ])(),
  };
};
