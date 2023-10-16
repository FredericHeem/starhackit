const assert = require("assert");
const { pipe, tap } = require("rubico");
const { switchCase, map, get } = require("rubico");
const {} = require("rubico/x");

const mount = require("koa-mount");
const log = require("logfilename")(__filename);

const configuration = {
  features: {
    clientCredentials: { enabled: true },
  },
  clientDefaults: {
    response_types: ["id_token"],
    grant_types: ["client_credentials"],
  },
  scopes: ["openid"],
  clients: [
    {
      client_id: "grucloud",
      client_secret: "bar",
      redirect_uris: [],
      response_types: [],
      grant_types: ["client_credentials"],
    },
  ],
  grant_types: ["client_credentials"],

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
