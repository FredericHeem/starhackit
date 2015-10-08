import Log from 'logfilename';
import assert from 'assert';
import _ from 'lodash';

export default function(app, publisherUser){
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
    log.debug("register user ", req.user);
    if(req.user && req.user.id){
      publisherUser.publish("new", JSON.stringify(req.user));
    } else {
      log.info("user already registered");
    }

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
