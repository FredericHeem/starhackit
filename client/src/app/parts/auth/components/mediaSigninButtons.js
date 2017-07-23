import React from 'react';
import glamorous from 'glamorous';
import button from 'mdlean/lib/button';
import config from 'config';
import FbSvg from 'icons/facebook.svg';

export default (context) => {
  const { tr } = context;

  const socialAuthMap = {
    facebook: {
      label: `${tr.t('Sign in with')} Facebook`,
      href: 'api/v1/auth/facebook',
      icon: <img src={FbSvg} alt="facebook" width={20} />,
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

  const SocialButtonView = glamorous('div')({
    margin: '20px auto 20px auto',
    width: 256,
  });

  function SocialButton({ label, href, icon }) {
    const Button = button(context);
    return (
      <SocialButtonView>
        <Button
          fullWidth
          label={label}
          href={href}
          icon={icon || null}
        />
      </SocialButtonView>
    );
  }

  function MediaSignin() {
    const { socialAuth = [] } = config;
    return (
      <div>
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
