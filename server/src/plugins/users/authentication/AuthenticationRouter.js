import passport from 'passport';
import express from 'express';
import AuthenticationHttpController from './AuthenticationHttpController';

export default function(app, auth, publisherUser){
  let router = new express.Router();
  let authenticationHttpCtrl = AuthenticationHttpController(app, publisherUser);
  router.post('/login', passport.authenticate('login'), authenticationHttpCtrl.login);
  router.post('/register', authenticationHttpCtrl.register);
  router.post('/verify_email_code', authenticationHttpCtrl.verifyEmailCode);
  router.post('/reset_password', authenticationHttpCtrl.resetPassword);
  router.post('/verify_reset_password_token', authenticationHttpCtrl.verifyResetPasswordToken);

  router.post('/logout', auth.ensureAuthenticated, authenticationHttpCtrl.logout);

  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', successRedirect : '/my/profile'}),
    authenticationHttpCtrl.loginFacebookCallback);

  return router;
}
