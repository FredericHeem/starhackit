const assert = require("assert");
const { tap, pipe } = require("rubico");
const { keys } = require("rubico/x");

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

const buildOrder = (sql) => (order) => {
  if (order) {
    return sql`ORDER BY ${sql(order[0])} ${
      order[0] == "ACS" ? sql`ASC` : sql`DESC`
    }`;
  } else {
    return sql``;
  }
};

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
  ({ attributes, where, order = ["created_at", "DESC"] }) =>
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
        WHERE ${buildWhere(sql)(where)}
        ${buildOrder(sql)(order)};`,
      tap((params) => {
        assert(params);
      }),
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
      ${sql(data, ...keys(data))} RETURNING *;`,
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
