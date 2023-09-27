const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { defaultsDeep, identity } = require("rubico/x");
const nanoid = require("nanoid");
const { insert } = require("utils/SqlOps");

module.exports = ({ sql }) => {
  const tableName = "workspace";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ workspace_id: `workspace-${nanoid.nanoid(8)}` }),
        fork({ out: identity, query: insert({ tableName, sql }) }),
      ])(),
    getAllByProject: ({ where: { project_id } }) =>
      pipe([
        tap(() => {
          assert(project_id);
        }),
        () => sql`
          SELECT 
            workspace.workspace_id,
            workspace_name,
            workspace.project_id,
            project.project_name,
            project.org_id,
            org.org_name
          FROM workspace
              INNER JOIN (
                  project
                  INNER JOIN org ON org.org_id = project.org_id
              ) ON workspace.project_id = project.project_id
              AND project.project_id = ${project_id};`,
      ])(),
    getAllByUser: ({ where: { user_id } }) =>
      pipe([
        tap(() => {
          assert(user_id);
        }),
        () => sql`
          SELECT 
            workspace.workspace_id,
            workspace_name,
            workspace.project_id,
            project.project_name,
            project.org_id,
            org.org_name
          FROM workspace
              INNER JOIN (
                  project
                  INNER JOIN org ON org.org_id = project.org_id
                  INNER JOIN (
                      user_orgs
                      INNER JOIN users ON users.user_id = user_orgs.user_id
                  ) ON project.org_id = user_orgs.org_id
              ) ON workspace.project_id = project.project_id
              AND users.user_id = ${user_id};`,
      ])(),
  };
};
