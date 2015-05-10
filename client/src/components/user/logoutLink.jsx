"use strict";
var React = require("react");
var sessionActions = require("local/actions/sessionActions");

var LogoutLink = React.createClass({
  displayName: "LogoutLink",
  logoutHandler: function(e) {
    e.preventDefault();
    sessionActions.logout();
  },
  render: function() {
    return (<a className={this.props.className} href="logout" onClick={this.logoutHandler}>Logout</a>);
  }
});

module.exports = LogoutLink;
