const _ = require("lodash");
const Router = require("koa-66");
const passport = require("koa-passport");
const AuthenticationApi = require("./AuthenticationApi");
const jwt = require("jsonwebtoken");
const config = require("config");

let log = require("logfilename")(__filename);

const errorMsg = (err, info) => {
  if (info && info.message) {
    return info.message;
  } else if (err && err.message) {
    return err.message;
  } else {
    return "Unknown error";
  }
};

const localAuthCB = ctx => (err, user, info = {}) => {
  const jwtConfig = _.defaults(config.jwt, { secret: "secret" });
  log.debug(
    "localAuthCB %s, %s, %s",
    JSON.stringify(user),
    JSON.stringify(info),
    JSON.stringify(err)
  );
  if (user) {
    ctx.body = {
      user,
      token: jwt.sign(user, jwtConfig.secret, jwtConfig.options)
    };
    ctx.login(user, error => {
      if (error) {
        log.error("login ", error);
        throw error;
      } else {
        log.debug("login ok ");
      }
    });
  } else {
    ctx.status = 401;
    ctx.body = {
      error: {
        message: errorMsg(err, info)
      }
    };
  }
};

async function verifyLogin(models, username, password) {
  log.debug("verifyLogin username: ", username);
  let user = await models.User.findByUsernameOrEmail(username);
  if (!user) {
    log.info("userBasic invalid username user: ", username);
    return {
      error: {
        message: "Username and Password do not match"
      }
    };
  }
  //log.info("userBasic user: ", user.get());
  let result = await user.comparePassword(password);
  if (result) {
    log.debug("verifyLogin valid password for user: ", user.toJSON());
    return {
      user: user.toJSON()
    };
  } else {
    log.debug("verifyLogin invalid password user: ", user.get());
    return {
      error: {
        message: "Username and Password do not match"
      }
    };
  }
}

async function login(ctx, models) {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    ctx.status = 401;
    ctx.body = "Bad Request";
    return;
  }
  const { user, error } = await verifyLogin(models, username, password);
  if (user) {
    ctx.status = 200;
    ctx.body = {
      user,
      token: jwt.sign(user, config.jwt.secret, config.jwt.options)
    };
  } else {
    ctx.status = 401;
    ctx.body = {
      error
    };
  }
}
function AuthenticationHttpController(app) {
  log.debug("AuthenticationHttpController");
  let authApi = AuthenticationApi(app);
  let respond = app.utils.http.respond;

  return {
    login(ctx, next) {
      return login(ctx, app.data.models());
    },
    logout(ctx) {
      log.debug("logout");
      ctx.logout();
      ctx.body = {
        success: true
      };
    },
    async register(context) {
      return respond(context, authApi, authApi.createPending, [
        context.request.body
      ]);
    },
    async verifyEmailCode(context) {
      return respond(context, authApi, authApi.verifyEmailCode, [
        context.request.body
      ]);
    },
    async resetPassword(context) {
      return respond(context, authApi, authApi.resetPassword, [
        context.request.body
      ]);
    },
    async verifyResetPasswordToken(context) {
      return respond(context, authApi, authApi.verifyResetPasswordToken, [
        context.request.body
      ]);
    },
    async loginFacebook(context, next) {
      return passport.authenticate("facebook_mobile", localAuthCB(context))(
        context,
        next
      );
    },
    async loginGoogle(context, next) {
      return passport.authenticate("google_mobile", localAuthCB(context))(
        context,
        next
      );
    },
    async loginGoogleIdToken(context, next) {
      return passport.authenticate("google-id-token", localAuthCB(context))(
        context,
        next
      );
    }
  };
}

function AuthenticationRouter(app) {
  let router = new Router();
  let authHttpController = AuthenticationHttpController(app);
  router.post("/login", authHttpController.login);
  router.post("/logout", authHttpController.logout);
  router.post("/register", authHttpController.register);
  router.post("/reset_password", authHttpController.resetPassword);
  router.post("/verify_email_code", authHttpController.verifyEmailCode);
  router.post(
    "/verify_reset_password_token",
    authHttpController.verifyResetPasswordToken
  );

  // Facebook Auth from web
  router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );
  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      failureRedirect: "/user/auth/login",
      successRedirect: "/user/auth/login"
    })
  );
  // Facebook Auth from mobile
  router.post("/login_facebook", authHttpController.loginFacebook);

  //Google
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/user/auth/login",
      successRedirect: "/user/auth/login"
    })
  );
  router.post("/login_google", authHttpController.loginGoogle);

  router.post("/login_google_id_token", authHttpController.loginGoogleIdToken);

  app.server.baseRouter().mount("auth", router);

  return router;
}

exports.AuthenticationHttpController = AuthenticationHttpController;
module.exports = AuthenticationRouter;
