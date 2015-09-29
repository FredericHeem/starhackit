import React from 'react';
import marked from 'marked';

import TextArea from 'react-textarea-autosize';

export default React.createClass( {

    componentDidMount() {
        $( this.getDOMNode() ).find( 'textarea' ).markdown( {
            iconlibrary: 'fa',
            fullscreen: {
                enable: false
            },
            resize: 'both',
            hiddenButtons: [ 'cmdCode' ],

            onPreview: this.preview
        } );
    },

    render() {
        return (
            <div className="markdown-editor">
                <TextArea
                    useCacheForDOMMeasurements
                    {...this.props}
                    />
            </div>
        );
    },

    preview( e ) {
        return marked( e.getContent(), {
            sanitize: true,
            smartypants: true
        } );
    }

} );