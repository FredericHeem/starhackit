const pkg = require("../package.json");

module.exports = () => ({
  domainName: "starhack.it",
  keyPairName: "kp",
  projectName: pkg.name,
});
