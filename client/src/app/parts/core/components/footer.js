import React from 'react';
import glamorous from 'glamorous';

export default ({ tr, theme }) => {
  const {palette} = theme;
  const FooterView = glamorous('footer')(() => ({
    position: 'absolute',
    bottom: 0,
    paddingTop: 20,
    width: '100%',
    background: palette.primaryLight
  }));
  function Footer({ version }) {
    return (
      <FooterView className="hidden-print">
        <div className="container">
          <div className="row">
            <div className="content text-center">
              <div>
                {tr.t('StarHackIt is the starting point to build a full stack web application')}
              </div>
              <div>
                {tr.t('Get the source code at ')}
                <a
                  href="https://github.com/FredericHeem/starhackit"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {tr.t('GitHub')}
                </a>
              </div>
              <div>
                {version}
              </div>
            </div>
          </div>
        </div>
      </FooterView>
    );
  }
  return Footer;
};
