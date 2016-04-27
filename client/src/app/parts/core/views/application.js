import React from 'react';
import NavBar from '../components/navbar';
import Footer from '../components/footer';

import Debug from 'debug';
let debug = new Debug("views:app");

export default React.createClass( {
    componentWillMount () {
        //TODO
        //this.props.actions.me();
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
