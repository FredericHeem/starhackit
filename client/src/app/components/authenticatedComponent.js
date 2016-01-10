import React from 'react';
import authStore from 'stores/auth';
import { History } from 'react-router';
import Debug from 'debug';
let debug = new Debug("component:authenticated");

export default React.createClass({
    mixins: [History],

    componentWillMount: function () {
        debug('componentWillMount ', this.props.location.pathname);
        let nextPath = this.props.location.pathname;
        if (!authStore.isAuthenticated()) {
            debug('is not authenticated');
            this.history.pushState(null, `/login?nextPath=${nextPath}`);
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
