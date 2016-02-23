import React from 'react';
import DocTitle from 'components/docTitle';

import { connect } from 'react-redux'
import { logout } from 'redux/modules/auth'

export let LogoutView = React.createClass( {

    componentDidMount () {
        this.props.logout();
    },

    render() {
        return (
            <div id="logout">
                <DocTitle
                    title="Logout"
                />
                <div className="text-center">
                    <h1>Logged Out</h1>
                </div>

            </div>
        );
    }

} );

const mapStateToProps = (state) => ({
});

export default connect((mapStateToProps), {
    logout
})(LogoutView)
