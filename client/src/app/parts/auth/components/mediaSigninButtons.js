import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import config from 'config';
import './media-signin-buttons.styl';

export default ({ tr }) => {
  const socialAuthMap = {
    facebook: {
      label: `${tr.t('Sign in with')} Facebook`,
      href: 'api/v1/auth/facebook',
      icon: 'icon-facebook',
    },
    fidor: {
      label: `${tr.t('Sign in with')} Fidor`,
      href: 'api/v1/auth/fidor',
    },
    crossbank: {
      label: `${tr.t('Sign in with')} Open Bank`,
      href: 'api/v1/crossbank/login',
    },
  };

  function SocialButton({ label, href, icon }) {
    return (
      <div className="btn-social-login">
        <RaisedButton
          style={{
            width: '100%',
          }}
          label={label}
          href={href}
          icon={icon ? <FontIcon className={icon} /> : null}
        />
      </div>
    );
  }

  function MediaSignin() {
    const { socialAuth = [] } = config;
    return (
      <div className="media-signin-buttons">
        {socialAuth.map(name => {
          const auth = socialAuthMap[name];
          if (!auth) return null;
          return <SocialButton key={name} label={auth.label} href={auth.href} icon={auth.icon} />;
        })}
      </div>
    );
  }

  return MediaSignin;
};
