const assert = require("assert");
const { GoogleProvider } = require("@grucloud/provider-google");
const hook = require("./hook");

const createResources = async ({ provider, resources: {} }) => {
  const { stage } = provider.config;

  return {};
};
exports.createResources = createResources;

exports.createStack = async () => {
  const provider = GoogleProvider({ config: require("./config") });
  const { stage } = provider.config;
  assert(stage, "missing stage");

  const resources = await createResources({
    provider,
    resources: {},
  });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
