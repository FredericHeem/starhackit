const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { defaultsDeep, identity, keys } = require("rubico/x");
const nanoid = require("nanoid");
const { insert } = require("utils/SqlOps");

module.exports = ({ sql }) => {
  const tableName = "org";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ org_id: `org-${nanoid.nanoid(8)}` }),
        fork({ out: identity, query: insert({ tableName, sql }) }),
      ])(),
    update: ({ data, where: { org_id, user_id } }) =>
      pipe([
        tap((param) => {
          assert(data);
          assert(org_id);
          assert(user_id);
        }),
        async () => ({
          out: data,
          query: await sql`
          UPDATE ${sql(tableName)}
          SET ${sql(data, keys(data))}
          WHERE org_id IN (
                  SELECT org_id
                  FROM user_orgs
                  WHERE user_id = ${user_id} AND org_id = ${org_id}
              );
          `,
        }),
      ])(),
    destroy: ({ where: { org_id, user_id } }) =>
      pipe([
        tap((param) => {
          assert(org_id);
          assert(user_id);
        }),
        () =>
          sql`
          DELETE from ${sql(tableName)}
          WHERE org_id IN (
                  SELECT org_id
                  FROM user_orgs
                  WHERE user_id = ${user_id} AND org_id = ${org_id}
              );
          `,
      ])(),
    getAllByUser: ({ user_id }) =>
      pipe([
        tap((param) => {
          assert(user_id);
        }),
        () => sql`
    SELECT org.org_id,
      org_name,
      (SELECT 
         COUNT(*)
         FROM project 
         WHERE org.org_id = project.org_id)
         AS project_count
      FROM org
      INNER JOIN (
          user_orgs
          INNER JOIN users ON users.user_id = user_orgs.user_id
      ) ON org.org_id = user_orgs.org_id
      AND users.user_id = ${user_id};`,
        tap((param) => {
          assert(true);
        }),
      ])(),
    addUser: ({ org_id, user_id }) =>
      pipe([
        tap((param) => {
          assert(user_id);
          assert(org_id);
        }),
        () =>
          sql`INSERT INTO user_orgs ${sql(
            { org_id, user_id },
            "org_id",
            "user_id"
          )}`,
        tap((param) => {
          assert(true);
        }),
      ])(),
  };
};
