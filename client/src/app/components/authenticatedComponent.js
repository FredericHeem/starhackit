import React from 'react';
import Debug from 'debug';
let debug = new Debug("component:authenticated");
import { connect } from 'react-redux'

export let AuthenticatedView = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    propTypes:{
        authenticated: React.PropTypes.bool.isRequired
    },
    componentWillMount: function () {
        debug('componentWillMount pathname: ', this.props.location.pathname);
        let nextPath = this.props.location.pathname;
        if (!this.props.authenticated) {
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

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated
});

export default connect((mapStateToProps), {
})(AuthenticatedView)
