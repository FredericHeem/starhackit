const assert = require("assert");
const { pipe, tap, get, eq, not, assign, fork } = require("rubico");

const { CompactSign, exportJWK, generateKeyPair } = require("jose");
const nanoid = require("nanoid");

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

const api = ({ sql, privateKey, publicJwk, issuer }) => ({
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
          assign({
            iat: () => Math.floor(new Date().getTime() / 1000),
            //TODO
            // aud: pipe([
            //   get("client_id"),
            //   callProp("split", ":"),
            //   fork({
            //     org_id: callProp("at", 1),
            //     project_id: callProp("at", 3),
            //     workspace_id: callProp("at", 5),
            //   }),
            //   tap((params) => {
            //     assert(params);
            //   }),
            //   (where) => ({ where }),
            // ]),
          }),
          ({ client_id, iat, aud }) => ({
            aud,
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

module.exports = async function OidProvider(app) {
  const { config } = app;
  const { sql } = app.data;
  if (!config.oidc) return;
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  const publicJwk = await exportJWK(publicKey);

  app.server.createRouter(
    api({
      sql,
      privateKey,
      publicJwk: { ...publicJwk, use: "sig", alg: "RS256", kid: "grucloud" },
      ...config.oidc,
    }),
    app.server.rootRouter
  );

  return {};
};
