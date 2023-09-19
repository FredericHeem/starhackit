module.exports = () => {
  const tableName = "org";
  return {
    insert: ({ org_id, name }) =>
      `INSERT INTO ${tableName} (org_id, name) VALUES ('${org_id}','${name}');`,
    delete: ({ org_id }) => `DELETE FROM ${tableName} WHERE org_id='${org_id}'`,
    getAllByUser: ({ user_id }) => `
    SELECT ${tableName}.org_id,
      name
      FROM ${tableName}
      INNER JOIN (
          user_orgs
          INNER JOIN users ON users.id = user_orgs.user_id
      ) ON ${tableName}.org_id = user_orgs.org_id
      AND users.id = '${user_id}';`,
    addUser: ({ org_id, user_id }) =>
      `INSERT INTO user_orgs (org_id, user_id) VALUES ('${org_id}','${user_id}');`,
  };
};
