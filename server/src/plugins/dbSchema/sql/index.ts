
console.log(require("./columns.sql"))
module.exports = {
  getColumns: require("./columns.sql"),
  getSequences: require("./sequences.sql"),
  getConstraints: require("./constraints.sql"),
  getTables: require('./tables.sql')
};
