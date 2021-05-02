const pkg = require("./package.json");

module.exports = () => ({
  domainName: "starhack.it",
  keyPairName: "starhackit",
  projectName: pkg.name,
});
