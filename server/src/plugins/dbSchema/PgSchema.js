'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var sql = require('./sql');

/**
 * Export a pg schema to json.
 *
 * @param connection
 * @returns {
 *  'schemaA': {
 *    'table1': {
 *      'column1: {
 *        'data_type': 'text',
 *        'is_nullable': true,
 *        ...
 *      }
 *    }
 *  }
 * }
 */
exports.toJSON = function (sequelize, schema) {
  var queries = [
    sequelize.query(sql.getSequences, { replacements: [schema], type: sequelize.QueryTypes.SELECT }),
    sequelize.query(sql.getColumns, { replacements: [schema], type: sequelize.QueryTypes.SELECT }),
    sequelize.query(sql.getTables, { replacements: [schema], type: sequelize.QueryTypes.SELECT }),
    sequelize.query(sql.getConstraints, { replacements: [schema], type: sequelize.QueryTypes.SELECT })
  ];

  return Promise.all(queries)
    .spread(function (sequences, columns, tables, constraints) {
      const columnGroups = _.groupBy(columns, 'table_name');
      return {
        tables: _.transform(_.keyBy(tables, 'table_name'), function (result, table, name) {
          result[name] = _.extend(table, {
            columns: _.keyBy(columnGroups[name], 'column_name')
          });
        }),
        constraints: _.transform(_.groupBy(constraints, 'table_name'), function (result, table, tableName) {
          result[tableName] = _.groupBy(table, 'column_name');
        }),
        sequences: _.transform(_.groupBy(sequences, 'table_name'), function (result, table, tableName) {
          result[tableName] = _.keyBy(sequences, 'column_name');
        })
      };
    });
};
