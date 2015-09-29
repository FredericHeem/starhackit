import React, {findDOMNode} from 'react';
import cx from 'classnames';

export default React.createClass( {

    getInitialState() {
        return {
            entering: true
        };
    },

    componentDidMount() {
        this.$modal = $( this.getDOMNode() )
            .find( '.modal' )
            .modal( {
                backdrop: false,
                keyboard: false
            } );

        $( 'body' )
            .bind( 'mousedown', this.handleMouseClickOutside )
            .bind( 'keyup', this.handleEscapeKey );

        this.props.registerCloseFunction( this.animatedClose );
    },

    componentWillUnmount() {
        $( 'body' )
            .unbind( 'mousedown', this.handleMouseClickOutside )
            .unbind( 'keyup', this.handleEscapeKey );
    },

    render() {
        let modalClasses = cx( 'modal animated', {
            fade: this.state.entering,
            bounceOutUp: !this.state.entering
        } );

        let dialogClasses = cx( 'modal-dialog', {
            'modal-lg': this.props.largeModal,
            'modal-sm': this.props.smallModal
        } );

        return (
            <div className="bootstrap-modal">
                <div className="modal-backdrop in"/>
                <div className={modalClasses}>
                    <div className={dialogClasses} ref="content">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.animatedClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                { this.props.title && <h5 className="modal-title">{this.props.title}</h5> }
                            </div>
                            { this.props.children }
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    animatedClose() {
        $('body')
            .removeClass( 'modal-open' )
            .css( { 'padding-right': '' } );

        setTimeout( () => {
            this.$modal.modal( 'hide' );
            this.props.closePortal();
        }, 700 );

        this.setState( {
            entering: false
        } );
    },

    handleMouseClickOutside( e ) {
        if ( isNodeInRoot( e.target, findDOMNode( this.refs.content ) ) ) {
            return;
        }

        //account for clicking on scroll bar if modal exceeds window height
        if ( ($( 'body' ).width() - e.pageX) <= getScrollBarWidth() ) {
            return;
        }

        e.preventDefault();
        this.animatedClose();
    },

    handleEscapeKey( e ) {
        if ( e.which === 27 ) { // escape key maps to keycode `27`
            e.preventDefault();
            this.animatedClose();
        }
    }

} );

/////////

function isNodeInRoot( node, root ) {
    while ( node ) {
        if ( node === root ) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function getScrollBarWidth () {
    var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
        widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
    $outer.remove();
    return 100 - widthWithScroll;
}