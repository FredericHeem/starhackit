const assert = require("assert");
const { pipe, tap, get } = require("rubico");

const mount = require("koa-mount");
const log = require("logfilename")(__filename);
const adapter = require("./adapter");

const configuration = {
  adapter,
  features: {
    clientCredentials: { enabled: true },
    claimsParameter: { enabled: true },
    resourceIndicators: {
      enabled: true,
      getResourceServerInfo(ctx, resourceIndicator) {
        log.debug("getResourceServerInfo", resourceIndicator);

        return {
          scope: "read",
          //TODO
          audience: "https://demo.grucloud.com",
          accessTokenTTL: 1 * 60 * 60, // 1 hour
          accessTokenFormat: "jwt",
        };
      },
    },
  },
  clientDefaults: {
    response_types: [],
    grant_types: ["client_credentials"],
  },
  scopes: ["openid"],
  clients: [
    // {
    //   client_id: "grucloud",
    //   client_secret: "bar",
    //   redirect_uris: [],
    //   response_types: [],
    //   grant_types: ["client_credentials"],
    // },
  ],
  claims: {
    sub: null,
    aud: null,
    exp: null,
    iat: null,
    iss: null,
    jti: null,
    nbf: null,
    ref: null,
    grucloud_run_phase: null,
    grucloud_workspace_id: null,
    grucloud_workspace_name: null,
    grucloud_organization_id: null,
    grucloud_organization_name: null,
    grucloud_project_id: null,
    grucloud_project_name: null,
    grucloud_run_id: null,
    grucloud_full_workspace: null,
  },
  // async extraTokenClaims(ctx, token) {
  //   return {
  //     "urn:idp:example:foo": "bar",
  //   };
  // },
  async findAccount(ctx, id) {
    console.log("findAccount", id);
    return {
      accountId: id,
      async claims(use, scope) {
        console.log("claims", scope);
        return { sub: id };
      },
    };
  },
};

module.exports = async function OidProvider(app) {
  const { config } = app;
  if (!config.oidc) return;

  const { koa } = app.server;
  const { default: Provider } = await import("oidc-provider");
  const issuer = get("oidc.issuer", "http://localhost:9000")(config);
  log.debug(`oidc ${issuer}`);
  const oidc = new Provider(issuer, configuration);

  koa.use(mount("/oidc", oidc.app));
  koa.proxy = true;
  return {};
};
