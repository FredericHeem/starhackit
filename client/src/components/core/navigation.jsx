"use strict";
var React = require("react");
var connect = require("local/libraries/tmp_connect");
var sessionStore = require("local/stores/session");
var ImmutableRenderMixin = require("react-immutable-render-mixin");
var HeaderSession = require("local/components/user/headerSession.jsx");
var debug = require('debug')('components:core:navigation')

var Navigation = React.createClass({
  mixins: [connect(sessionStore, "session"), ImmutableRenderMixin],
  componentDidMount: function() {
    var $ = require("jquery");
    $(document).foundation();
  },

  render: function() {
    debug("render");
    
    return (
      <nav className="top-bar foundation-bar" data-topbar role="navigation">
        <ul className="title-area">
          <li className="name">
            <a href="#"> StarterKit</a>
          </li>
          <li className="toggle-topbar menu-icon">
            <a href="#"><span>MENU</span></a>
          </li>
        </ul>
        <HeaderSession/>
      </nav>
    );
  }
});
module.exports = Navigation;

