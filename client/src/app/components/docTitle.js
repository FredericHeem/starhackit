import React from 'react';
import Helmet from 'react-helmet';
import config from 'config';

export default React.createClass({
    getDefaultProps() {
        return {
            title: ""
        };
    },
    getDocumentTitle() {
        return this.props.title + " - " + config.title;
    },
    render() {
        return (
             <Helmet
             title = {this.props.title}
             titleTemplate = {this.getDocumentTitle()}
             / >
        );
    }
});
