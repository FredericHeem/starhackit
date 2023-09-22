const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { callProp, isObject, keys, values } = require("rubico/x");

const buildWhere = (sql) =>
  pipe([
    tap((params) => {
      assert(sql);
    }),
    Object.entries,
    (res) =>
      res.map(
        ([k, v], index) => sql`${index ? sql`AND` : sql``} ${sql(k)} = ${v}`
      ),
  ]);

const findOne =
  ({ tableName, sql }) =>
  ({ attributes, where }) =>
    pipe([
      tap(() => {
        assert(sql);
        assert(tableName);
        assert(attributes);
        assert(where);
      }),
      () =>
        sql`
        SELECT ${sql(attributes)}
        FROM ${sql(tableName)}
        WHERE ${buildWhere(sql)(where)};`,
    ])();

exports.findOne = findOne;

const findAll =
  ({ tableName, sql }) =>
  ({ attributes, where }) =>
    pipe([
      tap(() => {
        assert(sql);
        assert(tableName);
        assert(attributes);
        assert(where);
      }),
      () =>
        sql`
        SELECT ${sql(attributes)} 
        FROM ${sql(tableName)} 
        WHERE ${buildWhere(sql)(where)};`,
    ])();

exports.findAll = findAll;

const insert =
  ({ tableName, sql }) =>
  (data) =>
    pipe([
      tap(() => {
        assert(sql);
        assert(data);
      }),
      () => sql`
      INSERT INTO ${sql(tableName)}
      ${sql(data, ...keys(data))};`,
    ])();
exports.insert = insert;

const update =
  ({ tableName, sql }) =>
  ({ data, where }) =>
    pipe([
      tap(() => {
        assert(data);
        assert(where);
      }),
      async () => ({
        out: data,
        query: await sql`
        UPDATE ${sql(tableName)}
        SET ${sql(data)}
        WHERE ${buildWhere(sql)(where)}`,
      }),
    ])();
exports.update = update;

const destroy =
  ({ tableName, sql }) =>
  ({ where }) =>
    pipe([
      tap(() => {
        assert(where);
      }),
      () => sql`
      DELETE FROM ${sql(tableName)}
      WHERE ${buildWhere(sql)(where)}`,
    ])();
exports.destroy = destroy;
