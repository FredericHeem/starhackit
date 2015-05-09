"use strict";
var React = require("react");
var DocTitle = require("react-document-title");
var navigationActions = require("local/actions/navigationActions");

var DocumentTitle = React.createClass({
  propTypes: {
    title: React.PropTypes.string
  },
  getDefaultProps: function () {
    return {
      title: ""
    };
  },
  getDocumentTitle: function() {
    var preFix = "";
    var postFix = " - React-spa demo";
    return preFix + this.props.title + postFix;
  },
  componentDidMount: function () {
    navigationActions.documentTitleUpdate(this.props.title);
  },
  componentDidUpdate: function (prevProps) {
    if (prevProps.title !== this.props.title) {
      navigationActions.documentTitleUpdate(this.props.title);
    }
  },
  render: function() {
    return (
      <DocTitle title={this.getDocumentTitle()}>
        {this.props.children}
      </DocTitle>
    );
  }
});

module.exports = DocumentTitle;
