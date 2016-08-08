import React from 'react';
import './footer.styl';

export default({tr}) => {
  function Footer({version}) {
    return (
      <footer className="footer hidden-print">
        <div className="container">
          <div className="row">
            <div className="content text-center">
              <div>{tr.t('StarHackIt is the starting point to build a full stack web application')}</div>
              <div>
                {tr.t('Get the source code at ')}
                <a href="https://github.com/FredericHeem/starhackit" target="_blank">{tr.t('GitHub')}</a>
              </div>
              <div>
                {version}
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  Footer.propTypes = {
    version: React.PropTypes.string.isRequired
  };
  return Footer;
}
