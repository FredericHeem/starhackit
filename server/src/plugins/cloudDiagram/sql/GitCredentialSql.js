const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { defaultsDeep, identity } = require("rubico/x");
const nanoid = require("nanoid");
const { insert, buildUpdateSet } = require("utils/SqlOps");

module.exports = () => {
  const tableName = "git_credential";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ git_credential_id: `cred-${nanoid.nanoid(8)}` }),
        fork({ out: identity, query: insert({ tableName }) }),
      ])(),
    getAllByOrg: ({
      attributes = ["username", "org_id"],
      where: { org_id, user_id },
    }) =>
      pipe([
        tap(() => {
          assert(org_id);
          assert(user_id);
        }),
        () => `
      SELECT ${tableName}.username, ${tableName}.org_id
        FROM ${tableName}
        INNER JOIN (
            user_orgs
            INNER JOIN users ON users.user_id = user_orgs.user_id
        ) ON ${tableName}.org_id = user_orgs.org_id
        AND users.user_id = '${user_id}';`,
      ])(),
  };
};
