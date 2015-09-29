import React from 'react';
import Reflux from 'reflux';

import {RouteHandler} from 'react-router';

import analyticsStore from 'stores/analytics';

import NavBar from 'components/navbar';
import Footer from 'components/footer';

export default React.createClass( {

    mixins: [
        Reflux.connect( analyticsStore )
    ],

    render() {
        return (
            <div id="application-view">
                <NavBar />

                <div className="container">
                    <RouteHandler />
                </div>

                <Footer />

            </div>
        );
    }

} );