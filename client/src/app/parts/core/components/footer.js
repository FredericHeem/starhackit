import React from 'react';
import glamorous from 'glamorous';

export default ({ tr }) => {
  const FooterView = glamorous('footer')({
    position: 'absolute',
    bottom: 0,
    paddingTop: 5,
    width: '100%',
    boxShadow: '0px -1px 1px rgba(0, 0, 0, 0.3)'
  });
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
