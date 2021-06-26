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
const {
  isEmpty,
  values,
  callProp,
  identity,
  defaultsDeep,
} = require("rubico/x");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
const pfs = fs.promises;
const path = require("path");
const changeCase = require("change-case");

const buildGitDirName = ({ user_id, name = "" }) =>
  path.resolve(
    process.cwd(),
    `output/user-${user_id}-${changeCase.snakeCase(name)}`
  );

const gitDir = ({ user_id, name }) =>
  pipe([
    () => buildGitDirName({ user_id, name }),
    tap((dir) => pfs.mkdir(dir, { recursive: true })),
  ])();

const gitIsConfigured = ({ gitCredential, gitRepository }) =>
  and([() => !isEmpty(gitCredential), () => !isEmpty(gitRepository)]);

const gitCloneOrPull = ({
  fs,
  http,
  dir,
  gitRepository: { url, branch = "master" },
  gitCredential,
  user,
}) =>
  pipe([
    tap(() => {
      assert(user.username);
      assert(user.email);
      console.log("gitCloneOrPull", dir);
      console.log("gitRepository url ", url);
      assert(dir);
      assert(url);
      assert(gitCredential.username);
      assert(gitCredential.password);
    }),
    switchCase([
      tryCatch(
        pipe([
          () => git.log({ fs, dir }),
          pipe([
            () => {
              console.log("git log ok");
            },
            () => true,
          ]),
        ]),
        pipe([
          () => {
            console.log("git log not ok");
          },
          () => false,
        ])
      ),
      () =>
        git.pull({
          fs,
          http,
          dir,
          ref: branch,
          singleBranch: true,
          author: {
            email: user.email,
            name: user.username,
          },
          onAuth: () => gitCredential,
        }),
      () =>
        git.clone({
          fs,
          http,
          dir,
          url,
          ref: branch,
          singleBranch: true,
          depth: 1,
          onAuth: () => gitCredential,
        }),
    ]),
  ])();

const getProject = ({ providerName, project }) =>
  pipe([
    switchCase([
      () => isEmpty(project),
      pipe([
        switchCase([
          () => providerName === "aws",
          () => "examples/aws/empty",
          () => providerName === "google",
          () => "examples/google/empty",
          () => providerName === "azure",
          () => "examples/azure/empty",
          () => providerName === "ovh",
          () => "examples/openstack/empty",
        ]),
        (directory) => ({
          directory,
          url: "https://github.com/grucloud/grucloud/",
          branch: "main",
        }),
      ]),
      () => project,
    ]),
    defaultsDeep({ directory: "", branch: "main" }),
    tap((defaulted) => {
      assert(defaulted);
    }),
  ])();

exports.gitPush = ({
  infra: { providerName, gitCredential, gitRepository, user, user_id, project },
  files,
  dirTemplate,
  dir,
  message,
}) =>
  switchCase([
    gitIsConfigured({ gitCredential, gitRepository }),
    tryCatch(
      pipe([
        tap(() => {
          assert(Array.isArray(files));
          assert(message);
          assert(user_id);
          assert(dir);
          console.log("gitPush");
          console.log(gitRepository);
          console.log(project);
        }),
        // Clone template
        () =>
          gitCloneOrPull({
            fs,
            http,
            dir: dirTemplate,
            gitRepository: getProject({ providerName, project }),
            gitCredential,
            user,
          }),
        // Clone user git repot
        () =>
          gitCloneOrPull({
            fs,
            http,
            dir,
            gitRepository,
            gitCredential,
            user,
          }),
        () => files,
        tap(
          map((filepath) =>
            pfs.copyFile(
              path.resolve(
                dirTemplate,
                getProject({ providerName, project }).directory,
                filepath
              ),
              path.resolve(dir, filepath)
            )
          )
        ),
        tap((files) => {
          console.log(files);
        }),
        tap(map((filepath) => git.add({ fs, dir, filepath }))),
        () =>
          git.commit({
            fs,
            dir,
            message,
            author: {
              name: user.username,
              email: user.email,
            },
          }),
        (result) =>
          git.push({
            fs,
            dir,
            http,
            onAuth: () => gitCredential,
          }),
        tap((result) => {
          //assert(result.ok);
          console.log("gitPush done", result);
        }),
      ]),
      (error) => {
        throw error;
      }
    ),
    () => {
      console.log("gitPush no credentials");
    },
  ])();

exports.gitPushInventory = ({
  infra: { name, gitCredential, gitRepository, user, user_id },
  message = "update inventory",
}) =>
  switchCase([
    gitIsConfigured({ gitCredential, gitRepository }),
    pipe([
      assign({ dir: () => gitDir({ user_id, name }) }),
      ({ dir, list, svg }) =>
        tryCatch(
          pipe([
            tap(() => {
              //assert(Array.isArray(files));
              assert(message), assert(user_id);
              assert(user.username);
              assert(user.email);
              assert(dir);
              assert(name);
              assert(gitRepository.url);
              assert(gitRepository.branch);
              assert(gitCredential.username);
              assert(gitCredential.password);
              console.log("gitPushInventory");
              console.log("name");
              console.log(name);
              console.log("gitRepository");
              console.log(gitRepository);
              console.log("dir");
              console.log(dir);
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
            () => pfs.writeFile(`${dir}/inventory.svg`, svg, "utf8"),
            () => git.add({ fs, dir, filepath: "inventory.svg" }),
            () =>
              git.commit({
                fs,
                dir,
                message,
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
