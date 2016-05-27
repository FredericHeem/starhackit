import React from 'react';
import tr from 'i18next';
import Debug from 'debug';

let debug = new Debug("components:alert");

export default React.createClass( {

    render() {
        let error = this.props.error;
        if(!error) {
            return (
                <div></div>
            );
        }
        debug('render ', error);
        return (
            <div className="alert alert-danger text-center animate bounceIn" role="alert">
                <div>{tr.t('An error occured')}: {error.name}</div>
                <div>{error.name}</div>
                <div>{error.message}</div>
                <div>{tr.t('Status Code')}: {error.status}</div>
            </div>
        );
    }

} );
