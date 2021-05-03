const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = ({ config }) => {
  return { provider: AwsProvider({ config }) };
};
