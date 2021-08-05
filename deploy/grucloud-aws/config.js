const pkg = require("./package.json");

module.exports = () => ({
  domainName: "grucloud.com",
  keyPairName: "grucloud-app",
  projectName: pkg.name,
  availabilityZoneSuffix: "b",
});
