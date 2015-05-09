"use strict";
var React = require("react");
var Navigation = require("./navigation.jsx");

var Header = React.createClass({
  render: function() {
    return (
    <header>
      <Navigation />
    </header>
    );
  }
});

module.exports = Header;
