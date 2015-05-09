"use strict";
var React = require("react");
var DocumentTitle = require("local/components/core/documentTitle.jsx");

var Home = React.createClass({
  render: function() {
    return (
      <DocumentTitle title="StarterKit">
        <div>
          <h1>Home</h1>
          <p>React + Node Starter Kit</p>
        </div>
      </DocumentTitle>
    );
  }
});
module.exports = Home;
