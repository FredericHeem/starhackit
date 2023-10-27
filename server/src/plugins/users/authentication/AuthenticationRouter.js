const assert = require("assert");
const { omit } = require("rubico");
const _ = require("lodash");
const Router = require("koa-66");
const passport = require("koa-passport");
const AuthenticationApi = require("./AuthenticationApi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { comparePassword } = require("utils/hashPassword");

let log = require("logfilename")(__filename);

//TODO configure
// const failureRedirect = "/user/auth/login";
// const successRedirect = "/infra/";
const failureRedirect = "/login";
const successRedirect = "/";

const errorMsg = (err, info) => {
  if (info && info.message) {
    return info.message;
  } else if (err && err.message) {
    return err.message;
  } else {
    return "Unknown error";
  }
};

const localAuthCB =
  (ctx) =>
  (err, user, info = {}) => {
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
        token: jwt.sign(user, jwtConfig.secret, jwtConfig.options),
      };
      ctx.login(user, (error) => {
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
          message: errorMsg(err, info),
        },
      };
    }
  };

async function verifyLogin({ models, email, password }) {
  assert(models);
  log.debug("verifyLogin username: ", email);
  const user = await models.user.findOne({
    attributes: ["user_id", "user_type", "email", "password_hash"],
    where: { email },
  });
  if (!user) {
    log.info("userBasic invalid username email: ", email);
    return {
      error: {
        message: "Username and Password do not match",
      },
    };
  }
  let result = await comparePassword({
    password,
    password_hash: user.password_hash,
  });

  if (result) {
    //log.debug("verifyLogin valid password for user: ", user);
    return {
      user: omit(["password_hash"])(user),
    };
  } else {
    log.debug("verifyLogin invalid password user: ", user);
    return {
      error: {
        message: "Username and Password do not match",
      },
    };
  }
}

async function login({ context, models }) {
  assert(models);
  const { email, password } = context.request.body;
  if (!email || !password) {
    context.status = 401;
    context.body = "Bad Request";
    return;
  }
  const { user, error } = await verifyLogin({
    models,
    email,
    password,
  });
  if (user) {
    context.status = 200;
    context.body = {
      user,
      token: jwt.sign(user, config.jwt.secret, config.jwt.options),
    };
  } else {
    context.status = 401;
    context.body = {
      error,
    };
  }
}
function AuthenticationHttpController({ app, models }) {
  assert(app);
  assert(models);
  log.debug("AuthenticationHttpController");
  let authApi = AuthenticationApi({ app, models });
  let respond = app.utils.http.respond;
  return {
    login(context, next) {
      return login({ context, models });
    },
    logout(ctx) {
      log.debug("logout");
      ctx.logout();
      ctx.body = {
        success: true,
      };
    },
    async register(context) {
      return respond(context, authApi, authApi.createPending, [
        context.request.body,
      ]);
    },
    async verifyEmailCode(context) {
      return respond(context, authApi, authApi.verifyEmailCode, [
        context.request.body,
      ]);
    },
    async resetPassword(context) {
      return respond(context, authApi, authApi.resetPassword, [
        context.request.body,
      ]);
    },
    async verifyResetPasswordToken(context) {
      return respond(context, authApi, authApi.verifyResetPasswordToken, [
        context.request.body,
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
    },
  };
}

function AuthenticationRouter({ app, models }) {
  assert(app);
  assert(models);

  let router = new Router();
  let authHttpController = AuthenticationHttpController({ app, models });
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
      failureRedirect,
      successRedirect,
    })
  );
  // Facebook Auth from mobile
  router.post("/login_facebook", authHttpController.loginFacebook);

  //Google
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  // TODO  Get state from query string
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect,
      successRedirect,
    })
  );
  router.post("/login_google", authHttpController.loginGoogle);

  router.post("/login_google_id_token", authHttpController.loginGoogleIdToken);

  //Github
  // TODO  Get redirect from query string
  router.get(
    "/github",
    passport.authenticate("github", {
      scope: ["repo"],
      state: { redirect: "/" },
    })
  );
  router.get(
    "/github/callback",
    passport.authenticate("github"),
    (context, next) => {
      if (context.req.user) {
        context.cookies.set(
          "github-access-token",
          context.req.user.access_token,
          {
            httpOnly: false,
          }
        );
        context.redirect("/");
      } else {
        context.redirect("/login");
      }
      next();
    }
  );
  //Gitlab
  router.get(
    "/gitlab",
    passport.authenticate("gitlab", {
      scope: "read_user api read_api",
      //TODO redirect
      state: { redirect: "/" },
    })
  );
  router.get(
    "/gitlab/callback",
    passport.authenticate("gitlab"),
    (context, next) => {
      if (context.req.user) {
        // context.cookies.set(
        //   "github-access-token",
        //   context.req.user.access_token,
        //   {
        //     httpOnly: false,
        //   }
        // );
        context.redirect("/");
      } else {
        context.redirect("/login");
      }
      next();
    }
  );
  app.server.baseRouter().mount("auth", router);

  return router;
}

exports.AuthenticationHttpController = AuthenticationHttpController;
module.exports = AuthenticationRouter;
