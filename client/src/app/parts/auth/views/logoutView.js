import React from 'react';
import tr from 'i18next';
import DocTitle from 'components/docTitle';

export default React.createClass( {
    propTypes:{
        actions: React.PropTypes.object
    },
    componentDidMount () {
        this.props.actions.logout();
    },

    render() {
        return (
            <div id="logout">
                <DocTitle
                    title="Logout"
                />
                <div className="text-center">
                    <h1>{tr.t('Logged Out')}</h1>
                </div>

            </div>
        );
    }

} );
