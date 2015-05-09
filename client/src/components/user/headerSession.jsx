"use strict";
var React = require("react");
var Router = require("react-router");
var Link = Router.Link;
var Mui = require("material-ui");
var NavLink = require("local/components/core/navLink.jsx");
var connect = require("local/libraries/tmp_connect");

var sessionStore = require("local/stores/session");
var ImmutableRenderMixin = require("react-immutable-render-mixin");
var LogoutLink = require("./logoutLink.jsx");

var HeaderSession = React.createClass({
  mixins: [connect(sessionStore, "session"), ImmutableRenderMixin],
  contextTypes: {
    router: React.PropTypes.func
  },
  render: function() {
    
    var iconMenuItems = 
      [
       { text: "Profile",
         onItemClick:function(){
           this.context.route.transitionTo("profile");
         }
       },
       { 
         text: "Logout", 
         iconClassName: "mdi mdi-clock",
         onItemClick:function(){
           
         }
       }
       ];

    var menu;
    if(this.state.session.get("auth")){
      menu = (
        <section className="top-bar-section">
          <ul className="left">
          
          
            <NavLink to="/profile" title="Profile" className="profile"/>
            <li to="/logout" className="logout"><LogoutLink/></li>
          </ul>
          
          <ul className="right">
          <li className="has-dropdown">
            <a href="#">Me</a>
            <ul className="dropdown">
              <NavLink to="/profile" title="Profile" className="profile"/>
              <li to="/logout" className="logout"><LogoutLink/></li>
            </ul>
          </li>
        </ul>
        
        </section>
      );
    } else {
      menu = (
          <section className="top-bar-section">
          <ul className="right">
          <NavLink to="/login" title="Login" className="login"/>
          <NavLink to="/signup" title="Register" className="register"/>
          </ul>
          </section>
          );
    }

    return menu;
  }
});

module.exports = HeaderSession;
