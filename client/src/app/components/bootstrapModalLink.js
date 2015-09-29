import React from 'react';
import Portal from 'react-portal';

import BootstrapModal from 'components/bootstrapModal';

export default React.createClass({

    render() {
        let Modal = this.props.modal;

        return (
            <Portal
                openByClickOn={this.props.elementToClick}
                closeOnEsc={false}
                closeOnOutsideClick={false}
                >
                <BootstrapModal
                    largeModal={this.props.large}
                    title={this.props.title}
                    registerCloseFunction={this.registerCloseFunction}
                    >
                    <Modal
                        action={this.props.action}
                        closeModal={this.closeModal}
                        />
                </BootstrapModal>
            </Portal>
        );
    },

    registerCloseFunction( closeModalFunc ) {
        this.closeModalFunc = closeModalFunc;
    },

    closeModal() {
        this.closeModalFunc();
    }

});



