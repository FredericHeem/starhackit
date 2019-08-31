import * as Promise from "bluebird";

export default function(app) {
  ["PushTokenModel"].forEach(model =>
    app.data.registerModel(__dirname, `./${model}`)
  );

  ["PushTokenApi"].forEach(model => require(`./${model}`).default(app));

  return {
    seedDefault() {
      const seedDefaultFns = [];
      return Promise.each(seedDefaultFns, fn => fn(app.data.models()));
    }
  };
};
