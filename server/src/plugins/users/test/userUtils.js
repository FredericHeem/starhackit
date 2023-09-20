const Promise = require("bluebird");
const assert = require("assert");
const _async = require("async");
const faker = require("faker");

function userUtils() {
  function createRandomRegisterConfig() {
    let userConfig = {
      password: "password",
      email: faker.internet.email(),
    };
    return userConfig;
  }
  async function registerRandom({ sql, models, client }) {
    assert(sql);
    assert(models);
    assert(client);
    let userConfig = createRandomRegisterConfig();

    let res = await client.post("v1/auth/register", userConfig);
    assert(res);
    assert(res.success);
    assert.equal(res.message, "confirm email");

    //Retrieve the code in the db
    let userPending = await sql.userPending.findOne({
      attributes: ["code", "email"],
      where: { email: userConfig.email },
    });
    assert.equal(userPending.email, userConfig.email);
    assert(userPending.code);

    await client.post("v1/auth/verify_email_code", { code: userPending.code });
    let user = await sql.user.findOne({
      attributes: ["email"],
      where: { email: userConfig.email },
    });
    assert.equal(user.email, userConfig.email);
    return userConfig;
  }

  return {
    registerRandom,
    createRandomRegisterConfig,
    async createBulk({ sql, models, client, userCount = 10, limit = 2 }) {
      return new Promise((resolve, reject) => {
        _async.timesLimit(
          userCount,
          limit,
          async function (i, next) {
            try {
              //console.log("DDDDDD", i, next);
              let userConfig = await registerRandom({ sql, models, client });
              assert(userConfig);
              //next(null, userConfig);
            } catch (err) {
              console.error("error creating user: ", err);
              //next(err);
            }
          },
          function (err, results) {
            assert(err === null, err + " passed instead of 'null'");
            assert(results);
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    },
  };
}

module.exports = userUtils;
