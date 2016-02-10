import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import { History } from 'react-router';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import authStore from 'stores/auth';
import config from 'config';
import Debug from 'debug';
let debug = new Debug("views:navbar");

function navLinks(authenticated){
    if(authenticated){
        return [
            {route: '/app', text: 'DASHBOARD'},
            {route: '/admin', text: 'ADMIN'},
            {route: '/app/my/profile', text: 'PROFILE'},
            {route: '/logout', text: 'LOGOUT'},
        ];
    } else {
        return [
            {route: '/login', text: 'LOGIN'},
            {route: '/signup', text: 'REGISTER'},
        ];
    }
};

export default React.createClass( {
    mixins: [
        Reflux.connect( authStore, 'user' ),
        History
    ],
    getInitialState() {
        return {
            open: false
        };
    },
    toggleNav(){
        debug('toggleNav');
        this.setState({open: !this.state.open});
    },
    handleNavChange(menuItem) {
        debug('handleNavChange ', menuItem.route);
        this.history.pushState(null, menuItem.route);
        this.setState({open: false});
    },
    renderMenuItem(){
        debug('handleNavChange ', this.state.user);
        return _.map(navLinks(authStore.isAuthenticated()), (menu, key) => {
            return (
                <MenuItem key={key} onTouchTap={_.partial(this.handleNavChange, menu)}>
                    {menu.text}
                </MenuItem>
            );
        });
    },
    render() {
        return (
            <div >
                <AppBar
                    id='app-bar'
                    title={config.title}
                    onLeftIconButtonTouchTap={this.toggleNav}/>
                <LeftNav
                    id='left-nav'
                    docked={false}
                    open={this.state.open}
                    onRequestChange={open => this.setState({open})}>
                    {this.renderMenuItem()}
                </LeftNav>
            </div>
        );
    }
} );
