const assert = require("assert");
const { pipe, tap, get, eq, not, assign } = require("rubico");
const { CompactSign, exportJWK, generateKeyPair } = require("jose");
const nanoid = require("nanoid");

// const mount = require("koa-mount");
// const log = require("logfilename")(__filename);
// const adapter = require("./adapter");

const alg = "RS256";
const expires_in = 3600;

const wellKnow = ({ issuer }) => ({
  authorization_endpoint: `${issuer}/oidc/auth`,
  claims_supported: ["sub", "aud", "exp", "iat", "iss", "jti", "nbf", "ref"],
  grant_types_supported: ["client_credentials"],
  issuer,
  jwks_uri: `${issuer}/oidc/jwks`,
  response_types_supported: ["id_token"],
  scopes_supported: ["openid"],
  subject_types_supported: ["public"],
  token_endpoint_auth_signing_alg_values_supported: ["RS256"],
  id_token_signing_alg_values_supported: ["RS256"],
  token_endpoint: `${issuer}/oidc/token`,
});

const api = ({ privateKey, publicJwk, issuer, audience }) => ({
  pathname: "/oidc",
  ops: [
    {
      pathname: "/token",
      method: "post",
      handler: (context) =>
        pipe([
          () => context,
          get("request.body"),
          tap((params) => {
            assert(issuer);
            assert(audience);
            assert(process.env.GRUCLOUD_OAUTH_CLIENT_SECRET);
          }),
          tap.if(not(get("client_id")), () => {
            context.body = { error: "missing client_id" };
            context.status = 400;
          }),
          tap.if(not(eq(get("grant_type"), "client_credentials")), () => {
            context.body = { error: "grant_type must be client_credentials" };
            context.status = 400;
          }),
          tap.if(
            not(
              eq(get("client_secret"), process.env.GRUCLOUD_OAUTH_CLIENT_SECRET)
            ),
            () => {
              context.body = { error: "invalid credentials" };
              context.status = 401;
            }
          ),
          assign({ iat: () => Math.floor(new Date().getTime() / 1000) }),
          ({ client_id, iat }) => ({
            aud: audience,
            client_id,
            exp: iat + expires_in,
            iat,
            iss: issuer,
            jti: nanoid.nanoid(8),
            sub: client_id,
          }),
          JSON.stringify,
          (text) =>
            new CompactSign(Buffer.from(text))
              .setProtectedHeader({ alg, typ: "JWT", kid: "grucloud" })
              .sign(privateKey),
          tap((access_token) => {
            context.body = {
              access_token,
              expires_in,
              token_type: "Bearer",
            };
            context.status = 200;
          }),
        ])(),
    },
    {
      pathname: "/jwks",
      method: "get",
      handler: (context) =>
        pipe([
          () => ({ keys: [publicJwk] }),
          tap((body) => {
            context.body = body;
            context.type = "application/jwk-set+json; charset=utf-8";
            context.status = 200;
          }),
        ])(),
    },
    {
      pathname: "/.well-known/openid-configuration",
      method: "get",
      handler: (context) =>
        pipe([
          tap(() => {
            context.body = wellKnow({ issuer });
            context.status = 200;
          }),
        ])(),
    },
  ],
});

// const configuration = ({ privateJwk }) => ({
//   adapter,
//   jwks: { keys: [privateJwk] },
//   features: {
//     clientCredentials: { enabled: true },
//     claimsParameter: { enabled: true },
//     resourceIndicators: {
//       enabled: true,
//       getResourceServerInfo(ctx, resourceIndicator) {
//         log.debug("getResourceServerInfo", resourceIndicator);

//         return {
//           scope: "read",
//           //TODO
//           audience: "https://demo.grucloud.com",
//           accessTokenTTL: 1 * 60 * 60, // 1 hour
//           accessTokenFormat: "jwt",
//         };
//       },
//     },
//   },
//   clientDefaults: {
//     response_types: [],
//     grant_types: ["client_credentials"],
//   },
//   scopes: ["openid"],
//   clients: [],
//   claims: {
//     sub: null,
//     aud: null,
//     exp: null,
//     iat: null,
//     iss: null,
//     jti: null,
//     nbf: null,
//     ref: null,
//     grucloud_run_phase: null,
//     grucloud_workspace_id: null,
//     grucloud_workspace_name: null,
//     grucloud_organization_id: null,
//     grucloud_organization_name: null,
//     grucloud_project_id: null,
//     grucloud_project_name: null,
//     grucloud_run_id: null,
//     grucloud_full_workspace: null,
//   },
//   // async extraTokenClaims(ctx, token) {
//   //   return {
//   //     "urn:idp:example:foo": "bar",
//   //   };
//   // },
//   async findAccount(ctx, id) {
//     console.log("findAccount", id);
//     return {
//       accountId: id,
//       async claims(use, scope) {
//         console.log("claims", scope);
//         return { sub: id };
//       },
//     };
//   },
// });

module.exports = async function OidProvider(app) {
  const { config } = app;
  if (!config.oidc) return;
  //const { koa } = app.server;
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  const publicJwk = await exportJWK(publicKey);

  app.server.createRouter(
    api({
      privateKey,
      publicJwk: { ...publicJwk, use: "sig", alg: "RS256", kid: "grucloud" },
      ...config.oidc,
    }),
    app.server.rootRouter
  );

  // const { default: Provider } = await import("oidc-provider");
  // const issuer = get("oidc.issuer", "http://localhost:9000")(config);
  // log.debug(`oidc ${issuer}`);
  // const oidc = new Provider(issuer, configuration({ privateJwk }));

  // koa.use(mount("/oidc", oidc.app));
  // koa.proxy = true;
  return {};
};
