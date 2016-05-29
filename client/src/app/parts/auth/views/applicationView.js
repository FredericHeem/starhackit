import React from 'react';
import NavBar from '../../core/components/navbar';
import Footer from '../../core/components/footer';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme(baseTheme);

// eslint-disable-next-line no-undef
let version = __VERSION__;

export default React.createClass( {
    propTypes:{
        authenticated: React.PropTypes.bool.isRequired,
        actions: React.PropTypes.object.isRequired,
        children: React.PropTypes.node
    },
    componentWillMount () {
        this.props.actions.me();
    },
    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div id="application-view">
                    <NavBar authenticated={this.props.authenticated}/>
                    <div id='main-container' className="container">
                        {this.props.children}
                    </div>

                    <Footer version={`${version}`}/>
                </div>
            </MuiThemeProvider>
        );
    }
});
