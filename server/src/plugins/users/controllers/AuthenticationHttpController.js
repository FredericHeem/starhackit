import Log from 'logfilename';
import assert from 'assert';
import _ from 'underscore';

export default function(/*app*/){
  let log = new Log(__filename);

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
    log.debug("register");

    return res.status(201).json({
      success:true,
      message: "confirm email"
    });
  }

  return {
    login:login,
    logout:logout,
    register:register,
    loginFacebookCallback:loginFacebookCallback
  };
}
