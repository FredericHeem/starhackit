const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
const pfs = fs.promises;
const os = require("os");
const uuid = require("uuid");
const testMngr = require("test/testManager");

const { gitPush, gitPushInventory } = require("../gitUtils");

const { PERSONAL_ACCESS_TOKEN, GIT_USERNAME, GIT_REPOSITORY } = process.env;

describe.skip("Git", function () {
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    assert(PERSONAL_ACCESS_TOKEN);
    assert(GIT_USERNAME);
    assert(GIT_REPOSITORY);
  });
  after(async () => {});

  it("gitPushInventory", async () => {
    const infra = {
      name: "my-project",
      gitCredential: {
        username: GIT_USERNAME,
        password: PERSONAL_ACCESS_TOKEN,
      },
      gitRepository: { url: GIT_REPOSITORY, branch: "master" },
      user: { username: "topolino", email: "topolino@mail.com" },
      user_id: uuid.v4(),
    };

    const input = {
      list: {},
      svg: "",
    };

    await gitPushInventory({
      infra,
    })(input);

    await gitPushInventory({
      infra,
      messsage: "update inventory again",
    })(input);
  });
  it("gitCreateProject from template eks", async () => {
    const infra = {
      provider_type: "aws",
      provider_name: "aws",
      gitCredential: {
        username: GIT_USERNAME,
        password: PERSONAL_ACCESS_TOKEN,
      },
      gitRepository: { url: GIT_REPOSITORY, branch: "master" },
      user: { username: "topolino", email: "topolino@mail.com" },
      user_id: uuid.v4(),
      project: {
        url: "https://github.com/grucloud/grucloud/",
        title: "Deploy a kubernetes cluster with EKS",
        directory: "examples/aws/EKS/eks-simple",
        branch: "main",
      },
    };
    await gitPush({
      infra,
      dirTemplate: await path.join(os.tmpdir(), "grucloud-example-template"),
      dir: await pfs.mkdtemp(
        path.join(os.tmpdir(), `grucloud-git-${infra.user_id}`)
      ),
      message: "new infra project",
    });
  });
  it("gitCreateProject from empty template", async () => {
    const infra = {
      provider_type: "aws",
      provider_name: "aws",
      gitCredential: {
        username: GIT_USERNAME,
        password: PERSONAL_ACCESS_TOKEN,
      },
      gitRepository: { url: GIT_REPOSITORY, branch: "master" },
      user: { username: "topolino", email: "topolino@mail.com" },
      user_id: uuid.v4(),
    };

    await gitPush({
      infra,
      dirTemplate: await path.join(os.tmpdir(), "grucloud-example-template"),
      dir: await pfs.mkdtemp(
        path.join(os.tmpdir(), `grucloud-git-${infra.user_id}`)
      ),
      message: "new infra project",
    });
  });
  it("gitCreateProject repo 404", async () => {
    const infra = {
      provider_type: "aws",
      provider_name: "aws",
      gitCredential: {
        username: GIT_USERNAME,
        password: PERSONAL_ACCESS_TOKEN,
      },
      gitRepository: {
        url: "https://github.com/FredericHeem/i-do-not-exist.git",
        branch: "master",
      },
      user: { username: "topolino", email: "topolino@mail.com" },
      user_id: uuid.v4(),
      project: {
        url: "https://github.com/grucloud/grucloud/",
        title: "Deploy a kubernetes cluster with EKS",
        directory: "packages/modules/aws/eks/example",
        branch: "main",
      },
    };
    try {
      await gitPush({
        infra,
        dirTemplate: await path.join(os.tmpdir(), "grucloud-example-template"),
        dir: await pfs.mkdtemp(
          path.join(os.tmpdir(), `grucloud-git-${infra.user_id}`)
        ),
        message: "new infra project",
      });
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.code, "HttpError");
      assert.equal(error.data.statusCode, 404);
    }
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
                ref: "master",
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
