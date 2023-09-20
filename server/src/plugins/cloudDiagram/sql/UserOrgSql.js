const { tap, pipe, fork } = require("rubico");
const assert = require("assert");

module.exports = () => {
  const tableName = "user_orgs";
  return {
    tableName,
  };
};
