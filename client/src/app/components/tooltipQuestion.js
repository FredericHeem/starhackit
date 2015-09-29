import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export default React.createClass( {

    getDefaultProps() {
        return {
            placement: 'left'
        };
    },

    render() {
        const tooltip = (
            <Tooltip>{ this.props.children }</Tooltip>
        );

        return (
            <span className="tooltip-question">
                <OverlayTrigger placement={ this.props.placement } overlay={ tooltip }>
                    <i className="fa fa-question-circle"></i>
                </OverlayTrigger>
            </span>
        );
    }

} );