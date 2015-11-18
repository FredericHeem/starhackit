import assert from 'assert';
import _ from 'lodash';
import AuthenticationApi from './AuthenticationApi';
let log = require('logfilename')(__filename);

export default function(app, publisherUser){
  let respond = app.utils.http.respond;
  let authApi = AuthenticationApi(app, publisherUser);

  function login(req, res) {
    log.debug("login",  req.user);
    res.send(_.omit(req.user, 'id'));
  }

  function loginFacebookCallback(/*req, res*/) {
    assert(false);
  }

  function logout(req, res) {
    log.debug("logout");
    req.logout();
    res.send({success:true});
  }

  function register(req, res) {
    log.debug("register user ", req.body);
    respond(authApi, authApi.createPending, [req.body], res);
  }

  function verifyEmailCode(req, res) {
    log.debug("verifyEmailCode: ", req.body);
    respond(authApi, authApi.verifyEmailCode, [req.body], res);
  }

  function resetPassword(req, res) {
    log.debug("resetPassword: ", req.body);
    respond(authApi, authApi.resetPassword, [req.body], res);
  }

  function verifyResetPasswordToken(req, res) {
    log.debug("verifyResetPasswordToken: ", req.body);
    respond(authApi, authApi.verifyResetPasswordToken, [req.body], res);
  }

  return {
    login:login,
    logout:logout,
    register:register,
    verifyEmailCode:verifyEmailCode,
    resetPassword:resetPassword,
    verifyResetPasswordToken:verifyResetPasswordToken,
    loginFacebookCallback:loginFacebookCallback
  };
}
