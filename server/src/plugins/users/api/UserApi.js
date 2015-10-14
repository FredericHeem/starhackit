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
      let user = await models.User.findByEmail(userPendingIn.email);

      if (!user) {
        let code = createToken();
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
    },
    async resetPassword(payload){
      let email = payload.email;
      log.info("resetPassword: ", email);
      let user = await models.User.findByEmail(email);
      if(user){
        log.info("resetPassword: find user: ", user.get());
        let passwordReset = {
          token: createToken(),
          user_id: user.id
        };
        await models.PasswordReset.upsert(passwordReset);
        // send password reset email with the token.
      } else {
        log.info("resetPassword: no such email: ", email);
      }

      return {
        success:true
      };
    },
    async verifyResetPasswordToken(payload){
      let {token, password} = payload;

      log.info("verifyResetPasswordToken: ", token);
      // Has the token expired ?

      // find the user
      let user = await models.User.find({
        include: [{
          model: models.PasswordReset,
          where: {
            token: token
          },
        }]
      });
      log.info("verifyResetPasswordToken: password ", password);

      if(user){
        await user.update({password: password});
        return {
          success:true
        };
      } else {
        log.warn("verifyResetPasswordToken: no such token ", token);
        return {
          error:{
            name:"TokenInvalid"
          }
        };
      }

      return {
        success:true
      };
    }
  };
}

function createToken(){
  return chance.string({
    length: 16,
    pool:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  });
}
