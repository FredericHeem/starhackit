const Promise = require("bluebird");

function ExpoPush(app) {
  ["PushTokenModel"].forEach(model =>
    app.data.registerModel(__dirname, `./${model}`)
  );

  ["PushTokenApi"].forEach(model => require(`./${model}`)(app));

  return {
    seedDefault() {
      const seedDefaultFns = [];
      return Promise.each(seedDefaultFns, fn => fn(app.data.models()));
    }
  };
};

module.exports = ExpoPush;