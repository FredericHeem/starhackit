import React from 'react';
import DocTitle from 'components/docTitle';

export default React.createClass( {

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
