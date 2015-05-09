"use strict";
var React = require("react");
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

// Components
var Header = require("./core/header.jsx");
var Footer = require("./core/footer.jsx");

var App = React.createClass({
  render: function() {
    return (
      <section className="app-container">
        <Header/>
        <div className="main">
          <RouteHandler />
        </div>
        <Footer/>
      </section>
    );
  }
});

module.exports = App;
