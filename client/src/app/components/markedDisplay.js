import React from 'react';
import marked from 'marked';

export default React.createClass( {

    render() {

        return (
            <div className="marked-display"
                dangerouslySetInnerHTML={{
                    __html: this.unsafeContent()
                }}
                 >
            </div>
        );

    },

    unsafeContent() {
        return marked( this.props.content, {
            breaks: true,
            sanitize: true,
            smartypants: true
        } );
    }

} );