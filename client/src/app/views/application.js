import React from 'react';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from './rawTheme';
import NavBar from 'components/navbar';
import Footer from 'components/footer';

import Debug from 'debug';
let debug = new Debug("views:app");

export default React.createClass( {

    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },

    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
        };
    },

    render() {
        debug('render ', this.props);
        return (
            <div id="application-view">
                <NavBar authenticated={this.props.authenticated}/>

                <div id='main-container' className="container">
                    {this.props.children}
                </div>

                <Footer />
            </div>
        );
    }
});
