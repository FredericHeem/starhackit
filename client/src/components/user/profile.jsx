"use strict";
var React = require("react");
var DocumentTitle = require("local/components/core/documentTitle");

var ImmutableRenderMixin = require("react-immutable-render-mixin");
var authRouteMixin = require("local/mixins/authRoute");

var Profile = React.createClass({
  displayName: "Profile",
  mixins: [ImmutableRenderMixin, authRouteMixin],
  render: function() {
    return (
      <DocumentTitle title="Profile">
        <div>
          <h1>Profile: {this.state.session.get("username")}</h1>
          <span>id: {this.state.session.get("id")}</span>
        </div>
      </DocumentTitle>
    );
  }
});

module.exports = Profile;
