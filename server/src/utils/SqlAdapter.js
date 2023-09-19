const assert = require("assert");
const { tap, pipe, get, tryCatch, map } = require("rubico");
const { when, first, callProp, isObject } = require("rubico/x");

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

module.exports =
  (sqlClient) =>
  ({ tableName, ...sqlOps }) => {
    const update = pipe([
      ({ data, where }) =>
        `UPDATE ${tableName} SET ${buildUpdateSet(data)} WHERE ${buildWhere(
          where
        )}`,
      tryCatch(
        pipe([(q) => sqlClient.query(q), get("rows")]),
        (error, query) => {
          console.error("Error running update sql query", query);
          console.error(error);
          throw error;
        }
      ),
    ]);
    return {
      ...new Proxy(sqlOps, {
        get:
          (target, name) =>
          (...args) =>
            pipe([
              () => target[name](...args),
              tap((param) => {
                assert(param);
                console.log(param);
              }),
              tryCatch(
                pipe([
                  (q) => sqlClient.query(q),
                  tap((param) => {
                    assert(param);
                  }),
                  get("rows"),
                  when(() => name.startsWith("getBy"), first),
                  when(
                    () => name.startsWith("count"),
                    pipe([
                      first,
                      get("count"),
                      tap((param) => {
                        assert(param);
                      }),
                      Number,
                    ])
                  ),
                ]),
                (error, query) => {
                  console.error("Error running sql query", query);
                  console.error(error);
                  throw error;
                }
              ),
            ])(),
      }),
      update,
    };
  };
