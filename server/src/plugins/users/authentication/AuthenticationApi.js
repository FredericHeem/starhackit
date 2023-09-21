const assert = require("assert");
const _ = require("lodash");
const Chance = require("chance");
let chance = new Chance();

function AuthenticationApi({ app, models }) {
  assert(models);
  let log = require("logfilename")(__filename);
  const { publisher } = app;
  let validateJson = app.utils.api.validateJson;
  return {
    async createPending(userPendingIn) {
      //validateJson(userPendingIn, require("./schema/createPending.json"));
      log.debug("createPending: ", userPendingIn);
      const user = await models.user.findOne({
        attributes: ["email"],
        where: { email: userPendingIn.email },
      });
      const userPendingEmail = await models.userPending.findOne({
        attributes: ["email"],
        where: { email: userPendingIn.email },
      });
      if (user || userPendingEmail) {
        throw {
          code: 422,
          name: "EmailExists",
          message: "The email is already used.",
        };
      }
      await models.userPending.insert(userPendingIn);
      await publisher.publish(
        "user.registering",
        JSON.stringify(userPendingIn)
      );
      return {
        success: true,
        message: "confirm email",
      };
    },
    async verifyEmailCode(param) {
      log.debug("verifyEmailCode: ", param);
      validateJson(param, require("./schema/verifyEmailCode.json"));
      const userPending = await models.userPending.findOne({
        attributes: ["email", "password_hash"],
        where: { code: param.code },
      });

      if (userPending) {
        log.debug("verifyEmailCode: userPending: ", userPending);
        const user = await models.user.insert(userPending);
        assert(user);
        await models.userPending.destroy({
          where: { email: userPending.email },
        });
        //log.debug("verifyEmailCode: created user ", user.toJSON());
        await publisher.publish("user.registered", JSON.stringify(userPending));
        return userPending;
      } else {
        log.warn("verifyEmailCode: no such code ", param.code);
        throw {
          code: 422,
          name: "NoSuchCode",
          message: "The email verification code is no longer valid.",
        };
      }
    },
    async resetPassword(payload) {
      validateJson(payload, require("./schema/resetPassword.json"));
      let email = payload.email;
      log.info("resetPassword: ", email);

      const user = await models.user.findOne({
        attributes: ["user_id", "email"],
        where: { email },
      });

      if (user) {
        log.info("resetPassword: find user id: ", user.user_id);
        let token = createToken();
        let passwordReset = {
          data: {
            password_reset_token: token,
            password_reset_date: new Date().toISOString(),
          },
          where: { user_id: user.user_id },
        };
        await models.user.update(passwordReset);
        // send password reset email with the token.
        let passwordResetPublished = {
          code: token,
          email: user.email,
        };
        //log.debug("resetPassword: publish: ", passwordResetPublished);
        await publisher.publish(
          "user.resetpassword",
          JSON.stringify(passwordResetPublished)
        );
      } else {
        log.info("resetPassword: no such email: ", email);
      }

      return {
        success: true,
      };
    },
    async verifyResetPasswordToken(payload) {
      validateJson(payload, require("./schema/verifyResetPasswordToken.json"));
      const { token, password } = payload;
      log.info("verifyResetPasswordToken: ", token);
      // Has the token expired ?
      // find the user
      const user = await models.user.findOne({
        attributes: ["password_reset_date", "user_id"],
        where: { password_reset_token: token },
      });

      if (user) {
        const now = new Date();
        assert(user.password_reset_date);
        assert(user.user_id);

        const paswordResetDate = user.password_reset_date;
        // Valid for 24 hours
        paswordResetDate.setUTCHours(paswordResetDate.getUTCHours() + 24);
        await models.user.update({
          data: {
            password_reset_token: null,
          },
          where: { user_id: user.user_id },
        });

        if (now < paswordResetDate) {
          await models.user.updatePassword({
            user_id: user.user_id,
            password: password,
          });
          return {
            success: true,
          };
        } else {
          throw {
            code: 422,
            name: "TokenInvalid",
            message: "The token has expired.",
          };
        }
      } else {
        log.warn("verifyResetPasswordToken: no such token ", token);

        throw {
          code: 422,
          name: "TokenInvalid",
          message: "The token is invalid or has expired.",
        };
      }
    },
  };
}

function createToken() {
  return chance.string({
    length: 16,
    pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  });
}

module.exports = AuthenticationApi;
