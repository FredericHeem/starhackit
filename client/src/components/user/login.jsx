"use strict";
var React = require("react");
var connect = require("local/libraries/tmp_connect");

var mui = require("material-ui");
var DocumentTitle = require("local/components/core/documentTitle.jsx");

var sessionStore = require("local/stores/session");
var sessionActions = require("local/actions/sessionActions");

var Login = React.createClass({
  mixins: [connect(sessionStore, "session")],

  // Transition
  statics: {
    willTransitionTo: function (transition, params) {
      if (sessionStore.isLoggedIn()) {
        transition.redirect("profile");
      }
    },

    willTransitionFrom: function () {
      sessionActions.setLoginReturnPath(null);
    }
  },

  componentWillUpdate: function() {
    var router = require("local/core/router").router;

    if (sessionStore.isLoggedIn()) {
      if (this.state.session.get("returnPath")) {
        router.transitionTo(this.state.session.get("returnPath"));
      }
      else {
        router.transitionTo("profile");
      }
    }
  },

  // Helpers
  handleSubmit: function(evt) {
    evt.preventDefault();
    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();

    if (this.validate(username, password)) {
      sessionActions.login(username, password);
    }
  },
  validate: function(username, password) {
    // Check title
    if (!username) {
      this.setState({usernameError: "Username cannot be empty!"});
      username = false;
    }
    else {
      this.setState({usernameError: null});
    }

    // Check content
    if (!password) {
      this.setState({passwordError: "Password cannot be empty!"});
      password = false;
    }
    else {
      this.setState({passwordError: null});
    }
    return username && password;
  },
  clearErrors: function() {
    this.setState({usernameError: null});
    this.setState({passwordError: null});
  },

  // Element
  render: function() {
    // Show message if available
    var msg;
    if (this.state.session.get("msg")) {
      msg = (
        <div data-alert className="alert-box alert">
          {this.state.session.get("msg")}
          <a href="#" className="close">&times;</a>
        </div>
      );
    }
    else {
      msg = null;
    }

    return (
      <DocumentTitle title="Login">
        <div className="row">
          <div className="large-12 columns text-center">
            <h1>Login</h1>
            <form onSubmit={this.handleSubmit} onChange={this.clearErrors}>
              {msg}
              <div className="row collapse">
                <mui.TextField
                  ref="username"
                  name="username"
                  required={true}
                  errorText={this.state.usernameError}
                  type="text"
                  autoFocus={true}
                  floatingLabelText="Username" />
                <br/>
                <mui.TextField
                  ref="password"
                  name="password"
                  required={true}
                  errorText={this.state.passwordError}
                  type="password"
                  floatingLabelText="Password" />
                <br/>
                <mui.FlatButton type="submit" label="Submit" primary={true}/>
              </div>
            </form>
            <br/>
          </div>
        </div>
      </DocumentTitle>
    );
  }
});

module.exports = Login;
