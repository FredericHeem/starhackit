import React from 'react';
import NavBar from '../../core/components/navbar';
import Footer from '../../core/components/footer';

export default React.createClass( {
    componentWillMount () {
        this.props.actions.me();
    },
    render() {
        return (
            <div id="application-view">
                <NavBar authenticated={this.props.authenticated}/>

                <div id='main-container' className="container">
                    {this.props.children}
                </div>

                <Footer version={`${__VERSION__}`}/>
            </div>
        );
    }
});
