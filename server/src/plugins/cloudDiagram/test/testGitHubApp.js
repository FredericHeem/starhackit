const assert = require("assert");
const { pipe, tap, tryCatch, map, eq, get } = require("rubico");
const { find } = require("rubico/x");

const fs = require("fs").promises;
const Axios = require("axios");

const testMngr = require("test/testManager");
const { GeneralSign, importPKCS8 } = require("jose");

const gitHubAppId = "412623";
const alg = "RS256";

let privateKey;
const username = "FredericHeem";

const getGitHubJwt = ({ gitHubAppId, privateKey, alg }) =>
  pipe([
    () => Math.floor(new Date().getTime() / 1000),
    (iat) => ({
      iss: gitHubAppId,
      exp: iat + 10 * 60,
      iat,
    }),
    tap((params) => {
      assert(params);
    }),
    JSON.stringify,
    (text) => new TextEncoder().encode(text),
    async (encoded) =>
      new GeneralSign(encoded)
        .addSignature(await importPKCS8(privateKey, alg))
        .setProtectedHeader({ alg })
        .sign(),
    tap((params) => {
      assert(params);
    }),
    ({ signatures, payload }) =>
      `${signatures[0].protected}.${payload}.${signatures[0].signature}`,
    tap((params) => {
      assert(params);
    }),
  ]);

const getInstallationByUser =
  ({ token }) =>
  ({ username }) =>
    pipe([
      tap(() => {
        assert(token);
        assert(username);
      }),
      () => ({
        method: "GET",
        url: `https://api.github.com/users/${username}/installation`,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }),
      Axios.request,
      tap((params) => {
        assert(params);
      }),
    ])();

const getInstallations = ({ token }) =>
  pipe([
    tap(() => {
      assert(token);
    }),
    () => ({
      method: "GET",
      url: `https://api.github.com/app/installations`,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }),
    Axios.request,
    tap((params) => {
      assert(params);
    }),
  ]);

const getInstallationToken =
  ({ token }) =>
  ({ access_tokens_url }) =>
    pipe([
      tap(() => {
        assert(token);
        assert(access_tokens_url);
      }),
      () => ({
        method: "POST",
        url: access_tokens_url,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }),
      Axios.request,
      tap((params) => {
        assert(params);
      }),
      get("data"),
    ])();

describe("GitHub App", function () {
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    // openssl pkcs8 -topk8 -inform pem -in grucloud-console-dev.private-key.pem -outform pem -nocrypt -out private_pkcs8.pem
    privateKey = await fs.readFile(__dirname + "/private_pkcs8.pem", "utf-8");
  });

  it("token", () =>
    tryCatch(
      pipe([
        getGitHubJwt({ gitHubAppId, privateKey, alg }),
        (token) =>
          pipe([
            tap(() => {
              assert(true);
            }),
            () => ({ username }),
            getInstallationByUser({ token }),
            tap((params) => {
              assert(params);
            }),
            getInstallations({ token }),
            get("data"),
            find(eq(get("account.login"), username)),
            tap(({ access_tokens_url }) => {
              assert(access_tokens_url);
            }),
            getInstallationToken({ token }),
            ({ token }) => ({
              method: "GET",
              url: `https://api.github.com/users/${username}/repos`,
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            Axios.request,
            tap((params) => {
              assert(params);
            }),
          ])(),
      ]),
      (error) => {
        throw error;
      }
    )());
});

// it("octokit", () =>
//   tryCatch(
//     pipe([
//       () =>
//         new Octokit({
//           authStrategy: createAppAuth,
//           auth: {
//             appId: gitHubAppId,
//             privateKey: privateKey,
//             installationId,
//           },
//         }),
//       tap((params) => {
//         assert(params);
//       }),
//       (octokit) =>
//         pipe([
//           () => octokit.rest.apps.getAuthenticated(),
//           tap((params) => {
//             assert(params);
//           }),
//           () =>
//             octokit.rest.repos.listForUser({
//               username,
//             }),
//           tap((params) => {
//             assert(params);
//           }),
//         ])(),
//       tap((params) => {
//         assert(params);
//       }),
//     ]),
//     (error) => {
//       throw error;
//     }
//   )());
