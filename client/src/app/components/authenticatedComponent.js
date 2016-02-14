import React from 'react';
import authStore from 'stores/auth';
import Debug from 'debug';
let debug = new Debug("component:authenticated");

export default React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentWillMount: function () {
        debug('componentWillMount pathname: ', this.props.location.pathname);
        let nextPath = this.props.location.pathname;
        if (!authStore.isAuthenticated()) {
            debug('is not authenticated');
            this.context.router.push(`/login?nextPath=${nextPath}`);
        } else {
            debug('is authenticated');
        }
    },
    componentDidUpdate: function () {
        this.componentWillMount();
    },
    getInitialState: function () {
        return {};
    },
    render: function () {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});
