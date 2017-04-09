import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import config from 'config';
import './media-signin-buttons.styl';

export default ({tr}) => {

  function Facebook() {
    return (
      <div className="btn-social-login">
        <RaisedButton
          label={`${tr.t("Sign in with")} Facebook`} style={{
          width: '100%'
        }} href="/api/v1/auth/facebook" icon={< FontIcon className="icon-facebook" />}
        />
      </div>
    );
  }

  function Fidor() {
    return (
      <div className="btn-social-login">
        <RaisedButton
          style={{
          width: '100%'
        }} label={`${tr.t("Sign in with")} Fidor`} linkButton href="/api/v1/auth/fidor"
        />
      </div>
    );
  }

  function OpenBank() {
    return (
      <div className="btn-social-login">
        <RaisedButton
          style={{
          width: '100%'
        }} label={`${tr.t("Sign in with")} OpenBank`} linkButton href="/api/v1/crossbank/login"
        />
      </div>
    );
  }

  function MediaSignin() {
    const {socialAuth = {}} = config;
    return (
      <div className="media-signin-buttons">
        {socialAuth.facebook && <Facebook />}
        {socialAuth.fidor && <Fidor />}
        {socialAuth.crossbank && <OpenBank />}
      </div>
    )
  }

  return MediaSignin;
}
