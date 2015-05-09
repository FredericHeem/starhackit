"use strict";
var React = require("react");
var Router = require("react-router");
var classSet = require("react/lib/cx");
var Link = Router.Link;

var NavigationLink = React.createClass({
  propTypes: {
    activeClassName: React.PropTypes.string.isRequired,
    to: React.PropTypes.string.isRequired
  },
  contextTypes: {
    router: React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      activeClassName: "active"
    };
  },
  getClassName: function () {
    var classNames = {};

    if (this.props.className) {
      classNames[this.props.className] = true;
    }
    if (this.context.router.isActive(this.props.to, this.props.params, this.props.query)) {
      classNames[this.props.activeClassName] = true;
    }

    return classSet(classNames);
  },
  render: function() {
    return (
      <span className="navlink">
        <Link to={this.props.to}>{this.props.title}</Link>
      </span>
    );
  }
});
module.exports = NavigationLink;
