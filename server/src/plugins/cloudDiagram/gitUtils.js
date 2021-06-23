const assert = require("assert");

const {
  pipe,
  tap,
  tryCatch,
  assign,
  get,
  eq,
  switchCase,
  map,
  or,
  and,
  not,
} = require("rubico");
const { isEmpty, values, callProp, identity } = require("rubico/x");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
const pfs = fs.promises;
const path = require("path");

const buildGitDirName = ({ user_id }) =>
  path.resolve(process.cwd(), `output/user-${user_id}`);

const gitDir = ({ user_id }) =>
  pipe([
    () => buildGitDirName({ user_id }),
    tap((dir) => pfs.mkdir(dir, { recursive: true })),
  ])();

const gitIsConfigured = ({ gitCredential, gitRepository }) =>
  and([() => !isEmpty(gitCredential), () => !isEmpty(gitRepository)]);

const gitCloneOrPull = ({
  fs,
  http,
  dir,
  gitRepository,
  gitCredential,
  user,
}) =>
  pipe([
    tap(() => {
      assert(user.username);
      assert(user.email);
      assert(dir);
      assert(gitRepository.url);
      assert(gitRepository.branch);
      assert(gitCredential.username);
      assert(gitCredential.password);
    }),
    switchCase([
      tryCatch(pipe([() => git.log({ fs, dir }), () => true]), () => false),
      () =>
        git.pull({
          fs,
          http,
          dir,
          ref: gitRepository.branch,
          singleBranch: true,
          author: {
            email: user.email,
            name: user.username,
          },
          onAuth: (url) => {
            return gitCredential;
          },
        }),
      () =>
        git.clone({
          fs,
          http,
          dir,
          url: gitRepository.url,
          ref: gitRepository.branch,
          singleBranch: true,
          depth: 1,
        }),
    ]),
  ])();

exports.gitPush = ({
  infra: { gitCredential, gitRepository, user, user_id },
}) =>
  switchCase([
    gitIsConfigured({ gitCredential, gitRepository }),
    pipe([
      assign({ dir: () => gitDir({ user_id }) }),
      ({ dir, list }) =>
        tryCatch(
          pipe([
            tap(() => {
              assert(user_id);
              assert(user.username);
              assert(user.email);
              assert(dir);
              assert(gitRepository.url);
              assert(gitRepository.branch);
              assert(gitCredential.username);
              assert(gitCredential.password);
            }),
            () =>
              gitCloneOrPull({
                fs,
                http,
                dir,
                gitRepository,
                gitCredential,
                user,
              }),
            tap((result) => {
              assert(true);
            }),
            () =>
              pfs.writeFile(
                `${dir}/inventory.json`,
                JSON.stringify(list, null, 4),
                "utf8"
              ),
            () => git.add({ fs, dir, filepath: "inventory.json" }),
            () =>
              git.commit({
                fs,
                dir,
                message: "inventory.json update",
                author: {
                  name: user.username,
                  email: user.email,
                },
              }),
            () =>
              git.push({
                fs,
                dir,
                http,
                onAuth: (url) => {
                  return gitCredential;
                },
              }),
            tap((result) => {
              //assert(result.ok);
            }),
          ]),
          (error) => {
            throw error;
          }
        )(),
    ]),
    () => undefined,
  ]);
