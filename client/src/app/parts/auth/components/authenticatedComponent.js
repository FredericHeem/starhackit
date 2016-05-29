import React from 'react';
import Debug from 'debug';
let debug = new Debug("containers:authenticated");

export default React.createClass({
    displayName: 'Authenticated',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    propTypes:{
        authenticated: React.PropTypes.bool.isRequired,
        location: React.PropTypes.object.isRequired,
        children: React.PropTypes.node
    },
    componentWillMount() {
        debug('componentWillMount pathname: ', this.props.location.pathname);
        let nextPath = this.props.location.pathname;
        if (!this.props.authenticated) {
            debug('is not authenticated');
            this.context.router.push(`/login?nextPath=${nextPath}`);
        } else {
            debug('is authenticated');
        }
    },
    componentDidUpdate() {
        this.componentWillMount();
    },
    getInitialState() {
        return {};
    },
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});
