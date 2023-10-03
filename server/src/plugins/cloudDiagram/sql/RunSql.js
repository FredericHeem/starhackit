const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { defaultsDeep, identity } = require("rubico/x");
const { insert } = require("utils/SqlOps");

module.exports = ({ sql }) => {
  const tableName = "run";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({}),
        fork({ out: identity, query: insert({ tableName, sql }) }),
      ])(),
    getAllByUser: ({ where: { user_id } }) =>
      pipe([
        tap(() => {
          assert(user_id);
        }),
        () => sql`
SELECT run.run_id,
  run.status,
  run.kind,
  run.container_state,
  run.container_id,
  workspace.workspace_id,
  workspace_name,
  workspace.project_id,
  project.project_name,
  project.org_id,
  org.org_name
FROM run
  INNER JOIN (
    workspace
    INNER JOIN (
      project
      INNER JOIN org ON org.org_id = project.org_id
      INNER JOIN (
        user_orgs
        INNER JOIN users ON users.user_id = user_orgs.user_id
      ) ON project.org_id = user_orgs.org_id
    ) ON workspace.project_id = project.project_id
  ) ON run.workspace_id = workspace.workspace_id
  AND users.user_id = ${user_id}
  ORDER BY run.created_at DESC;`,
      ])(),
  };
};
