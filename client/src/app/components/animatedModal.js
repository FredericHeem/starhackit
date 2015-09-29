import React from 'react';

export default React.createClass( {

    componentDidMount() {
        let $this = $( this.getDOMNode() );
        let $hook = $this.find( '.hook' );

        $hook.animatedModal( {
            afterClose: triggerClose.bind( this )
        } )
            .open();

        function triggerClose() {
            this.props.closePortal();
        }
    },

    render() {
        return (
            <div className="animated-modal">
                <a className="hook" href={this.props.useId || '#animatedModal'}></a>
                <div id={ this.props.useId || 'animatedModal' }>
                    <div className="close-modal close-animatedModal">
                        <i className="fa fa-times"></i>
                    </div>
                    <div className="animated-modal-content">
                        { this.props.children }
                    </div>
                </div>
            </div>
        );
    }

} );