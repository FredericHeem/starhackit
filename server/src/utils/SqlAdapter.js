const assert = require("assert");
const { tap, pipe, get, tryCatch, switchCase } = require("rubico");
const { first } = require("rubico/x");

const { findOne, insert, update, destroy } = require("utils/SqlOps");

module.exports =
  (sqlClient) =>
  ({ tableName, ...sqlOps }) => {
    assert(tableName);
    return {
      ...new Proxy(
        {
          findOne: findOne({ tableName }),
          insert: insert({ tableName }),
          update: update({ tableName }),
          destroy: destroy({ tableName }),
          ...sqlOps,
        },
        {
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
                  (query) =>
                    pipe([
                      () => sqlClient.query(query?.query ?? query),
                      tap((param) => {
                        assert(param);
                      }),
                      switchCase([
                        // insert
                        () => name.startsWith("insert"),
                        pipe([
                          tap((param) => {
                            assert(param);
                          }),
                          () => query.out,
                        ]),
                        // Find one
                        () => name.startsWith("getBy") || name == "findOne",
                        pipe([get("rows"), first]),
                        // Count
                        () => name.startsWith("count"),
                        pipe([
                          get("rows"),
                          first,
                          get("count"),
                          tap((param) => {
                            assert(param);
                          }),
                          Number,
                        ]),
                        // Default
                        pipe([get("rows")]),
                      ]),
                    ])(),
                  (error, query) => {
                    console.error("Error running sql query", query);
                    console.error(error);
                    throw error;
                  }
                ),
              ])(),
        }
      ),
    };
  };
