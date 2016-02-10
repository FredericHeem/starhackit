import React from 'react';
import Reflux from 'reflux';

import analyticsStore from 'stores/analytics';

import NavBar from 'components/navbar';
import Footer from 'components/footer';

import Debug from 'debug';
let debug = new Debug("views:app");

export default React.createClass( {

    mixins: [
        Reflux.connect( analyticsStore )
    ],

    componentDidMount() {
        debug('componentDidMount');
    },
    render() {
        return (
            <div id="application-view">
                <NavBar />

                <div id='main-container' className="container">
                    {this.props.children}
                </div>

                <Footer />
            </div>
        );
    }
} );
