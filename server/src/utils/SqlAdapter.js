const assert = require("assert");
const { tap, pipe, get, tryCatch, switchCase } = require("rubico");
const { first } = require("rubico/x");

const { findOne, findAll, insert, update, destroy } = require("utils/SqlOps");

module.exports =
  ({ sql }) =>
  ({ tableName, ...sqlOps }) => {
    assert(sql);
    assert(tableName);
    return {
      ...new Proxy(
        {
          findOne: findOne({ tableName, sql }),
          findAll: findAll({ tableName, sql }),
          insert: insert({ tableName, sql }),
          update: update({ tableName, sql }),
          destroy: destroy({ tableName, sql }),
          ...sqlOps,
        },
        {
          get:
            (target, name) =>
            (...args) =>
              pipe([
                tryCatch(
                  () =>
                    pipe([
                      switchCase([
                        // insert
                        () => name.startsWith("insert"),
                        pipe([
                          () => target[name](...args),
                          tap((param) => {
                            console.log(param.query?.statement?.string);
                          }),
                          tap((param) => {
                            assert(true);
                          }),
                          get("query"),
                          first,
                        ]),
                        () => name.startsWith("update"),
                        pipe([
                          () => target[name](...args),
                          tap((param) => {
                            console.log(param.query?.statement?.string);
                          }),
                          tap((param) => {
                            assert(true);
                          }),
                          get("out"),
                        ]),
                        // Find one
                        () => name.startsWith("getBy") || name == "findOne",
                        pipe([() => target[name](...args), first]),
                        // Count
                        () => name.startsWith("count"),
                        pipe([
                          () => target[name](...args),
                          first,
                          get("count"),
                          tap((param) => {
                            assert(param);
                          }),
                          Number,
                        ]),
                        // Default
                        pipe([() => target[name](...args)]),
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
