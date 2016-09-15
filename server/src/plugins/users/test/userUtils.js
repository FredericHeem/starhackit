import Promise from 'bluebird';
import assert from 'assert';
let chance = require('chance')();
import _async from 'async';
export default function () {
  return {
    async createBulk(models, client, userCount = 10, limit = 2){
      return new Promise((resolve, reject) => {
        _async.timesLimit(userCount, limit, async(i, next) => {
          try {
            let userConfig = await this.registerRandom(models, client);
            next(null, userConfig);
          } catch(err){
            console.error("error creating user: ", err);
            next(err);
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
    createRandomRegisterConfig: function(){
      let username = `${chance.first()}.${chance.first()}.${chance.last()}`;
      let userConfig = {
        username: username,
        password: 'password',
        email: username + "@mail.com"
      };
      return userConfig;
    },
    registerRandom: async function (models, client){
      let userConfig = this.createRandomRegisterConfig();

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
    /*,
    createRandomUser: async function (){
      let username = chance.name();
      let userConfig = {
          username: username,
          password: "password",
          email: username + "@mail.com"
      };
      let userCreated = await models.User.createUserInGroups(userConfig, ["User"]);
      return userCreated;
    }
    */
};
};
