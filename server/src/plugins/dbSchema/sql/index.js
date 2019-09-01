var fs = require('fs');

module.exports = {
  getColumns: fs.readFileSync(__dirname + '/columns.sql').toString(),
  getSequences: fs.readFileSync(__dirname + '/sequences.sql').toString(),
  getConstraints: fs.readFileSync(__dirname + '/constraints.sql').toString(),
  getTables: fs.readFileSync(__dirname + '/tables.sql').toString()
};
