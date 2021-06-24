const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const createResources = async ({ provider, resources: {} }) => {
  const { stage } = provider.config;

  return {};
};
exports.createResources = createResources;

exports.createStack = async () => {
  const provider = AwsProvider({ config: require("./config") });
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
