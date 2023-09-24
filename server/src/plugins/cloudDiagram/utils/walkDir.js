const assert = require("assert");
const { pipe, tap, flatMap, switchCase } = require("rubico");
const { callProp } = require("rubico/x");
const path = require("path");
const fs = require("fs").promises;

const walkDir =
  ({ baseDir }) =>
  (dir) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => fs.readdir(path.resolve(baseDir, dir), { withFileTypes: true }),
      flatMap(
        switchCase([
          callProp("isDirectory"),
          pipe([({ name }) => path.join(dir, name), walkDir({ baseDir })]),
          pipe([({ name }) => [path.join(dir, name)]]),
        ])
      ),
    ])();

exports.walkDir = walkDir;
