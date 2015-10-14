import Log from 'logfilename';
import assert from 'assert';
import _ from 'lodash';

export default function(app, userApi){
  let log = new Log(__filename);
  let respond = app.utils.http.respond;

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
    respond(userApi, userApi.createPending, [req.body], res);
  }

  function verifyEmailCode(req, res) {
    log.debug("verifyEmailCode: ", req.body);
    respond(userApi, userApi.verifyEmailCode, [req.body], res);
  }

  function resetPassword(req, res) {
    log.debug("resetPassword: ", req.body);
    respond(userApi, userApi.resetPassword, [req.body], res);
  }

  function verifyResetPasswordToken(req, res) {
    log.debug("verifyResetPasswordToken: ", req.body);
    respond(userApi, userApi.verifyResetPasswordToken, [req.body], res);
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
