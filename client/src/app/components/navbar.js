import _ from 'lodash';
import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import config from 'config';
import Debug from 'debug';
let debug = new Debug("component:navbar");

function navLinks(authenticated) {
    if (authenticated) {
        return [
            {
                route: '/admin',
                text: 'ADMIN'
            }, {
                route: '/app',
                text: 'DASHBOARD'
            }, {
                route: '/app/my/profile',
                text: 'PROFILE'
            }, {
                route: '/logout',
                text: 'LOGOUT'
            }
        ];
    } else {
        return [
            {
                route: '/login',
                text: 'LOGIN'
            }, {
                route: '/signup',
                text: 'REGISTER'
            }
        ];
    }
};

export default React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.object.isRequired
    },
    propTypes:{
        authenticated: React.PropTypes.bool.isRequired
    },
    getInitialState () {
        return {open: false, muiTheme: this.context.muiTheme};
    },
    componentWillMount () {
        let newMuiTheme = this.state.muiTheme;
        //newMuiTheme.appBar.textColor = Colors.deepPurpleA700;

        this.setState({muiTheme: newMuiTheme});
    },
    toggleNav () {
        debug('toggleNav');
        this.setState({
            open: !this.state.open
        });
    },
    handleNavChange (menuItem) {
        debug('handleNavChange ', menuItem.route);
        this.context.router.push(menuItem.route);
        this.setState({open: false});
    },
    renderMenuItem () {
        //debug('handleNavChange ', this.props);
        return _.map(navLinks(this.props.authenticated), (menu, key) => {
            return (
                <MenuItem key={key} onTouchTap={_.partial(this.handleNavChange, menu)}>
                    {menu.text}
                </MenuItem>
            );
        });
    },
    render () {
        return (
            <div >
                <AppBar
                    style={{
                    }}
                    id='app-bar' title={config.title} onLeftIconButtonTouchTap={this.toggleNav}/>
                <LeftNav id='left-nav' docked={false} open={this.state.open} onRequestChange={open => this.setState({open})}>
                    {this.renderMenuItem()}
                </LeftNav>
            </div>
        );
    }
});
