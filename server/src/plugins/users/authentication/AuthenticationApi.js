import _ from 'lodash';
import Log from 'logfilename';
import Chance from 'chance';
let chance = new Chance();

export default function(app, publisherUser) {
  let models = app.data.sequelize.models;
  let log = new Log(__filename);
  let validateJson = app.utils.api.validateJson;
  return {
    async createPending(userPendingIn) {
      validateJson(userPendingIn, require('./schema/createPending.json'));
      log.debug("createPending: ", userPendingIn);

      let userByUsername = await models.User.findByUsername(userPendingIn.username);
      let userPendingByUsername = await models.UserPending.find({
        where:{
          username: userPendingIn.username
        }
      });
      if(userByUsername || userPendingByUsername){
        throw {
          code: 422,
          name: "UsernameExists",
          message: "The username is already used."
        };
      }
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
        await publisherUser.publish("user.registering", JSON.stringify(userPendingOut));
      } else {
        log.info("already registered", userPendingIn.email);
      }
      return {
        success: true,
        message: "confirm email"
      };
    },
    async verifyEmailCode(param){
      log.debug("verifyEmailCode: ", param);
      validateJson(param, require('./schema/verifyEmailCode.json'));
      let res = await models.UserPending.find({
        where: {
          code: param.code
        }
      });

      if(res){
        let userPending = res.get();
        log.debug("verifyEmailCode: userPending: ", userPending);
        let userToCreate = _.pick(userPending, 'username', 'email', 'passwordHash');
        let user = await models.User.createUserInGroups(userToCreate, ["User"]);
        //log.debug("verifyEmailCode: created user ", user.toJSON());
        await publisherUser.publish("user.registered", JSON.stringify(user.toJSON()));
        return user.toJSON();
      } else {
        log.warn("verifyEmailCode: no such code ", param.code);
        throw {
          code:422,
          name:"NoSuchCode",
          message: "The email verification code is no longer valid."
        };
      }
    },
    async resetPassword(payload){
      validateJson(payload, require('./schema/resetPassword.json'));
      let email = payload.email;
      log.info("resetPassword: ", email);
      let user = await models.User.findByEmail(email);
      if(user){
        log.info("resetPassword: find user id: ", user.get().id);
        let token = createToken();
        let passwordReset = {
          token: token,
          user_id: user.id
        };
        await models.PasswordReset.upsert(passwordReset);
        // send password reset email with the token.
        let passwordResetPublished = {
          code: token,
          email: user.email
        };
        log.debug("resetPassword: publish: ", passwordResetPublished);
        await publisherUser.publish('user.resetpassword', JSON.stringify(passwordResetPublished));
      } else {
        log.info("resetPassword: no such email: ", email);
      }

      return {
        success:true
      };
    },
    async verifyResetPasswordToken(payload){
      validateJson(payload, require('./schema/verifyResetPasswordToken.json'));
      let {token, password} = payload;

      log.info("verifyResetPasswordToken: ", token);
      // Has the token expired ?

      // find the user
      let user = await models.User.find({
        include: [{
          model: models.PasswordReset,
          where: {
            token: token
          }
        }]
      });
      //log.debug("verifyResetPasswordToken: password ", password);

      if(user){
        const now = new Date();
        const paswordResetDate = user.get().PasswordReset.get().created_at;
        // Valid for 24 hours
        paswordResetDate.setUTCHours(paswordResetDate.getUTCHours() + 24);

        await models.PasswordReset.destroy({
          where: {
            token
          }
        });

        if(now < paswordResetDate) {
          await user.update({password: password});
          return {
            success:true
          };
        } else {
          throw {
            code:422,
            name:"TokenInvalid",
            message: "The token has expired."
          };
        }
      } else {
        log.warn("verifyResetPasswordToken: no such token ", token);

        throw {
          code:422,
          name:"TokenInvalid",
          message: "The token is invalid or has expired."
        };
      }
    }
  };
}

function createToken(){
  return chance.string({
    length: 16,
    pool:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  });
}
