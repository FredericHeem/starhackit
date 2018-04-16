import Promise from "bluebird";

export default app => {
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
