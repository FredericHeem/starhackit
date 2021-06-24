const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const { first } = require("rubico/x");
const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
const pfs = fs.promises;
const os = require("os");
const uuid = require("uuid");
const { gitPush, gitPushInventory } = require("./gitUtils");

const { PERSONAL_ACCESS_TOKEN, GIT_USERNAME, GIT_REPOSITORY } = process.env;

const filesInfraProject = [
  "iac.js",
  "config.js",
  "package.json",
  "hook.js",
  "README.md",
];

describe("Git", function () {
  before(async function () {
    if (!PERSONAL_ACCESS_TOKEN) {
      return this.skip();
    }
    assert(GIT_USERNAME);
    assert(GIT_REPOSITORY);
  });
  after(async () => {});

  it("gitPushInventory", async () => {
    const infra = {
      gitCredential: {
        username: GIT_USERNAME,
        password: PERSONAL_ACCESS_TOKEN,
      },
      gitRepository: { url: GIT_REPOSITORY, branch: "main" },
      user: { username: "topolino", email: "topolino@mail.com" },
      user_id: uuid.v4(),
    };

    const input = {
      list: {},
    };

    await gitPushInventory({
      infra,
    })(input);

    await gitPushInventory({
      infra,
      messsage: "update inventory again",
    })(input);
  });
  it("gitCreateProject", async () => {
    const infra = {
      gitCredential: {
        username: GIT_USERNAME,
        password: PERSONAL_ACCESS_TOKEN,
      },
      gitRepository: { url: GIT_REPOSITORY, branch: "main" },
      user: { username: "topolino", email: "topolino@mail.com" },
      user_id: uuid.v4(),
    };

    await gitPush({
      infra,
      files: filesInfraProject,
      dirSource: path.resolve(__dirname, "template/gcp/empty"),
      dir: await pfs.mkdtemp(path.join(os.tmpdir(), "grucloud-template")),
      message: "new infra project",
    });
  });

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
