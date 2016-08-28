import _ from 'lodash';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import config from 'config';
import './media-signin-buttons.styl';

export default({tr}) => {
  return React.createClass({
    propTypes: {
      socialAuth: React.PropTypes.object
    },
    getDefaultProps() {
      return {socialAuth: _.extend({}, config.socialAuth)};
    },

    render() {
      let {socialAuth} = this.props;

      return (
        <div className="media-signin-buttons">
          {socialAuth.facebook && this.renderFacebook()}
          {socialAuth.fidor && this.renderFidor()}
        </div>
      );
    },

    renderFacebook() {
      return (
        <div className="btn-social-login">
          <RaisedButton label={`${tr.t("Sign in with")} Facebook`} style={{
            width: '100%'
          }} href="/api/v1/auth/facebook" icon={< FontIcon className = "icon-facebook" />}/>
        </div>
      );
    },
    renderFidor() {
      return (
        <div className="btn-social-login">
          <RaisedButton style={{
            width: '100%'
          }} label={`${tr.t("Sign in with")} Fidor`} linkButton={true} href="/api/v1/auth/fidor"/>
        </div>
      );
    }
  });
}
