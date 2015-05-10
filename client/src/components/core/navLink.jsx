"use strict";
var React = require("react");
var Router = require("react-router");
var NavigationStore = require("local/stores/navigation");
var Link = Router.Link;
var connect = require("local/libraries/tmp_connect");

var NavigationLink = React.createClass({
  mixins: [connect(NavigationStore)],
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
  render: function () {
    var { router } = this.context;
    var isActive = router.isActive(this.props.to, this.props.params, this.props.query);
    var className = isActive ? 'active' : '';
    var link = (
      <Link {...this.props} >{this.props.title}</Link>
    );
    return <li className={className}>{link}</li>;
  }
});
module.exports = NavigationLink;
