const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const { first } = require("rubico/x");
const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
const pfs = fs.promises;
const os = require("os");

const { PERSONAL_ACCESS_TOKEN, GIT_USERNAME, GIT_REPOSITORY } = process.env;

describe("Git", function () {
  before(async function () {
    if (!PERSONAL_ACCESS_TOKEN) {
      return this.skip();
    }
    assert(GIT_USERNAME);
    assert(GIT_REPOSITORY);
  });
  after(async () => {});

  it("clone", async () => {
    await tryCatch(
      pipe([
        () => pfs.mkdtemp(path.join(os.tmpdir(), "foo-")),
        tap((dir) => {
          console.log(dir);
        }),
        (dir) =>
          pipe([
            () =>
              git.clone({
                fs,
                http,
                dir,
                url: GIT_REPOSITORY,
                ref: "main",
                singleBranch: true,
                depth: 2,
              }),
            () => git.log({ fs, dir }),
            tap((logs) => {
              assert(Array.isArray(logs));
            }),
            () => git.status({ fs, dir, filepath: "README.md" }),
            tap((result) => {
              console.log(result);
            }),
            () => pfs.writeFile(`${dir}/newfile.txt`, "Hello World", "utf8"),
            () => git.add({ fs, dir, filepath: "newfile.txt" }),
            () =>
              git.commit({
                fs,
                dir,
                message: "add newfile.txt",
                author: {
                  name: "Mr. Test",
                  email: "mrtest@example.com",
                },
              }),
            tap((result) => {
              console.log(result);
            }),
            () =>
              git.push({
                fs,
                dir,
                http,
                onAuth: (url) => {
                  return {
                    username: GIT_USERNAME,
                    password: PERSONAL_ACCESS_TOKEN,
                  };
                },
              }),
            tap((result) => {
              console.log(result);
            }),
          ])(),
      ]),
      (error) => {
        throw error;
      }
    )();
  });
});
