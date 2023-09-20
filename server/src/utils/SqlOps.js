const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { callProp, isObject, keys, values } = require("rubico/x");

const buildSelectAttr = pipe([callProp("join", ", ")]);

const buildInsertAttr = pipe([keys, callProp("join", ", ")]);

const buildInsertValues = pipe([
  values,
  map((v) => `'${v}'`),
  callProp("join", ", "),
]);

const buildWhere = pipe([
  Object.entries,
  map(([k, v]) => `${k}='${v}'`),
  callProp("join", " AND "),
]);

const buildUpdateSet = pipe([
  Object.entries,
  map(([k, v]) => `${k}='${isObject(v) ? JSON.stringify(v) : v}'`),
  callProp("join", ", "),
]);
exports.buildUpdateSet = buildUpdateSet;

const findOne =
  ({ tableName }) =>
  ({ attributes, where }) =>
    pipe([
      tap(() => {
        assert(tableName);
        assert(attributes);
        assert(where);
      }),
      () =>
        `SELECT ${buildSelectAttr(
          attributes
        )} FROM ${tableName} WHERE ${buildWhere(where)};`,
    ])();

exports.findOne = findOne;

const insert =
  ({ tableName }) =>
  (data) =>
    pipe([
      tap(() => {
        assert(data);
      }),
      () =>
        `INSERT INTO ${tableName} (${buildInsertAttr(
          data
        )}) VALUES (${buildInsertValues(data)});`,
      tap((param) => {
        assert(true);
      }),
    ])();
exports.insert = insert;

const update =
  ({ tableName }) =>
  ({ data, where }) =>
    pipe([
      tap(() => {
        assert(data);
        assert(where);
      }),
      () => ({
        out: data,
        query: `UPDATE ${tableName} SET ${buildUpdateSet(
          data
        )} WHERE ${buildWhere(where)}`,
      }),
    ])();
exports.update = update;

const destroy =
  ({ tableName }) =>
  ({ where }) =>
    pipe([
      tap(() => {
        assert(where);
      }),
      () => `DELETE FROM ${tableName} WHERE ${buildWhere(where)}`,
    ])();
exports.destroy = destroy;
