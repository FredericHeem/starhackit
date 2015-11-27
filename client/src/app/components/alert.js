import React from 'react';

import Debug from 'debug';

let debug = new Debug("components:alert");

export default React.createClass( {
    /*
    propTypes: {
        error: React.PropTypes.object
    },
    */
    /*
    getDefaultProps() {
        return {
            error: {
                name:'',
                message:'',
                status:''
            }
        };
    },
*/
    render() {
        let error = this.props.error;
        debug('render ', error);
        debug('props ', this.props);
        if(!error) {
            return (
                <div></div>
            );
        }
        debug('render ', error);
        return (
            <div className="alert alert-danger text-center animate bounceIn" role="alert">
                <div>An error occured: {error.name}</div>
                <div>{error.message}</div>
                <div>Status Code: {error.status}</div>
            </div>
        );
    }

} );
