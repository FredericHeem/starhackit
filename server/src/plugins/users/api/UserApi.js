import _ from 'lodash';
import Log from 'logfilename';
import Chance from 'chance';
let chance = new Chance();

export default function UserApi(app, publisherUser) {
  let models = app.data.sequelize.models;
  let log = new Log(__filename);
  return {
    list: function (qs) {
      log.debug("list qs: ", qs);
      let filter = app.data.queryStringToFilter(qs, "id");
      return models.User.findAll(filter);
    },
    get: function (userId) {
      log.debug("get userId: ", userId);
      return models.User.findByUserId(userId);
    },
    async createPending(userPendingIn) {
      log.debug("createPending: ", userPendingIn);
      let user = await models.User.find({
        where: {
          email: userPendingIn.email
        }
      });

      if (!user) {
        let code = chance.string({
          length: 16,
          pool:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        });
        let userPendingOut = {
          code: code,
          username: userPendingIn.username,
          email: userPendingIn.email,
          password: userPendingIn.password
        };
        log.info("createPending code ", userPendingOut.code);
        await models.UserPending.create(userPendingOut);
        delete userPendingOut.password;
        await publisherUser.publish("user.register", JSON.stringify(userPendingOut));
      } else {
        log.info("already registered", userPendingIn.email);
      }
      return {
        success: true,
        message: "confirm email"
      };
    },
    async verifyEmailCode(param){
      let res = await models.UserPending.find({
        where: {
          code: param.code
        }
      });

      if(res){
        let userPending = res.get();
        log.debug("verifyEmailCode: userPending: ", userPending);
        let userToCreate = _.pick(userPending, 'username', 'email', 'passwordHash');
        //TODO transaction
        let user = await models.User.createUserInGroups(userToCreate, ["User"]);
        await models.UserPending.destroy({
          where:{
            code:param.code
          }
        });
        log.debug("verifyEmailCode: user ", user.toJSON());
        return user.toJSON();
      } else {
        log.warn("verifyEmailCode: no such code ", param.code);
        return Promise.reject({
          name:"NoSuchCode"
        });
      }
    }
  };
}
