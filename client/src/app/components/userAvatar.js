import _ from 'lodash';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default React.createClass( {

    getDefaultProps() {
        return {
            tipPlacement: 'top'
        };
    },

    render() {
        return (
            <div className="user-avatar">
                <div className="avatar-border">
                    { this.props.showTooltip &&
                        <OverlayTrigger placement={ this.props.tipPlacement } overlay={ this.tooltip() }>
                            { this.renderLocal() || this.renderImageUrl() }
                        </OverlayTrigger>
                    }

                    { !(this.props.showTooltip) && (this.renderLocal() || this.renderImageUrl()) }
                </div>
            </div>
        );
    },

    renderLocal() {
        let user = this.props.user;

        if ( !( _.get( user, 'image_url' ) ) ) {
            return (
                <i className="fa fa-user"></i>
            );
        }
    },

    renderImageUrl() {
        let user = this.props.user;

        if ( _.get( user, 'image_url' ) ) {
            return (
                <img src={ user.image_url }/>
            );
        }
    },

    tooltip() {
        return <Tooltip>{ _.get( this.props.user, 'name' ) }</Tooltip>;
    },

    initToolTip() {
        $( this.getDOMNode() ).find('[data-toggle="tooltip"]').tooltip();
    }

} );