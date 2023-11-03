function ExpoPush(app) {
  ["PushTokenApi"].forEach((api) => require(`./${api}`)(app));

  return {};
}

module.exports = ExpoPush;
