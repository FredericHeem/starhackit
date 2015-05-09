"use strict";
var React = require("react");
var DocumentTitle = require("local/components/core/documentTitle");

var NotFound = React.createClass({
  render: function() {
    return (
      <DocumentTitle title="404: Not found - iDC">
        <div>
          <h1>404</h1>
          <span>Path not found.. :(</span>
        </div>
      </DocumentTitle>
    );
  }
});

module.exports = NotFound;
