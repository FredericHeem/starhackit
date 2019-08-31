import * as Promise from 'bluebird';
import * as assert from 'assert';
import _async from 'async';
import * as faker from "faker";

export default function () {

  function createRandomRegisterConfig(){
    let userConfig = {
      username: faker.internet.userName(),
      password: 'password',
      email: faker.internet.email()
    };
    return userConfig;
  }
  async function registerRandom(models, client){
    let userConfig = createRandomRegisterConfig();

    let res = await client.post('v1/auth/register', userConfig);
    assert(res);
    assert(res.success);
    assert.equal(res.message, "confirm email");

    //Retrieve the code in the db
    res = await models.UserPending.find({
      where: {
        email: userConfig.email
      }
    });
    assert(res);
    let userPending = res.get();
    assert.equal(userPending.username, userConfig.username);
    assert.equal(userPending.email, userConfig.email);
    assert(userPending.code);

    //console.log("verify user ", userConfig);
    await client.post('v1/auth/verify_email_code', {code:userPending.code});
    res = await models.User.find({
      where: {
        email: userConfig.email
      }
    });
    assert(res);
    let user = res.toJSON();
    assert.equal(user.username, userConfig.username);
    assert.equal(user.email, userConfig.email);
    //console.log("user created ", user);
    return userConfig;
  }

  return {
    registerRandom,
    createRandomRegisterConfig,
    async createBulk(models, client, userCount = 10, limit = 2){
      return new Promise((resolve, reject) => {
        _async.timesLimit(userCount, limit, async function(i, next){
          try {
            console.log("DDDDDD", i, next);
            let userConfig = await registerRandom(models, client);
            //next(null, userConfig);
          } catch(err){
            console.error("error creating user: ", err);
            //next(err);
          }
        }, function (err, results) {
          assert(err === null, err + " passed instead of 'null'");
          assert(results);
          if(err){
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },

};
};
