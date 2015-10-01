import Log from 'logfilename';
import assert from 'assert';

export default function(/*app*/){
  let log = new Log(__filename);

  function login(req, res) {
    log.debug("login",  req.user);
    res.send({
      success:true,
      user: req.user
    });
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

  function session(req, res) {
    log.debug("session");
    res.send(req.user);
  }

  return {
    login:login,
    logout:logout,
    register:register,
    session:session,
    loginFacebookCallback:loginFacebookCallback
  };
}
